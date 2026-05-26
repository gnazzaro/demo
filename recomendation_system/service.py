import os
import torch
from django.conf import settings
from recomendation_system.vgshop_model import VgshopRCNeuralModel


class RecomendationSystemService:
    MODEL_DIR = settings.BASE_DIR / "recomendation_system/saved_models"
    MODEL_FILE = MODEL_DIR / "vgshop_model_trained.pt"

    def __init__(self):
        if not os.path.exists(self.MODEL_FILE):
            raise FileNotFoundError(
                "Modello non trovato. Esegui prima il comando di training."
            )

        complete_model = torch.load(self.MODEL_FILE, weights_only=False)

        self.map_user_code = complete_model["user_to_code"]
        self.map_game_code = complete_model["game_to_code"]
        self.total_tags = complete_model["total_tags"]
        self.all_tags = complete_model["all_tags"]
        self._game_code_to_tags = complete_model.get("_game_code_to_tags", {})

        self.model = VgshopRCNeuralModel(
            len(self.map_user_code), len(self.map_game_code), self.total_tags
        )
        self.model.load_state_dict(complete_model["model"])
        self.model.eval()

        print("Modello pronto !")

    @staticmethod
    def _extract_pk(obj):
        """
        Normalizza user/game ad una chiave confrontabile con quelle del dizionario.

        Accetta:
        - istanze di modelli Django  → restituisce obj.pk
        - interi, UUID, stringhe     → restituisce obj così com'è

        Questo risolve il caso comune in cui il chiamante passa request.user
        (un'istanza User) invece del suo pk — il dict ha chiavi pk, non istanze.
        """
        if hasattr(obj, "pk"):
            return obj.pk
        return obj

    def predict_score(self, user, game, game_tags):
        user_pk = self._extract_pk(user)
        game_pk = self._extract_pk(game)

        user_id = self.map_user_code.get(user_pk, None)
        game_id = self.map_game_code.get(game_pk, None)

        if user_id is None or game_id is None:
            # Log di debug per capire subito il tipo ricevuto vs quello atteso
            if user_id is None:
                sample_key = next(iter(self.map_user_code), None)
                print(
                    f"[RecomendationService] user non trovato: "
                    f"ricevuto {user_pk!r} (tipo {type(user_pk).__name__}), "
                    f"chiavi del dict di tipo {type(sample_key).__name__} "
                    f"(esempio: {sample_key!r})"
                )
            if game_id is None:
                sample_key = next(iter(self.map_game_code), None)
                print(
                    f"[RecomendationService] game non trovato: "
                    f"ricevuto {game_pk!r} (tipo {type(game_pk).__name__}), "
                    f"chiavi del dict di tipo {type(sample_key).__name__} "
                    f"(esempio: {sample_key!r})"
                )
            return None

        tag_list = [1 if tag in game_tags else 0 for tag in self.all_tags]
        user_tensor = torch.tensor([user_id], dtype=torch.long)
        game_tensor = torch.tensor([game_id], dtype=torch.long)
        tag_tensor = torch.tensor([tag_list], dtype=torch.float32)

        with torch.no_grad():
            prediction = self.model(user_tensor, game_tensor, tag_tensor)
            return prediction.item()

    def recommend_top_k(self, user, top_k: int = 10, exclude_games: list = None):
        """
        Restituisce i top_k giochi più interessanti per l'utente,
        ordinati per score discendente.

        Parametri
        ----------
        user          : istanza User Django O pk diretto (int/UUID)
        top_k         : numero di raccomandazioni
        exclude_games : pk dei giochi da escludere (istanze Django o pk grezzi)

        Ritorna
        -------
        Lista di (game_pk, score) ordinata per score decrescente.
        """
        user_pk = self._extract_pk(user)
        user_id = self.map_user_code.get(user_pk, None)
        if user_id is None:
            sample_key = next(iter(self.map_user_code), None)
            print(
                f"[RecomendationService] recommend: user non trovato: "
                f"ricevuto {user_pk!r} ({type(user_pk).__name__}), "
                f"chiavi del dict di tipo {type(sample_key).__name__}"
            )
            return []

        exclude_set = {self._extract_pk(g) for g in (exclude_games or [])}
        candidate_pks = [pk for pk in self.map_game_code if pk not in exclude_set]
        candidate_codes = [self.map_game_code[pk] for pk in candidate_pks]
        num_candidates = len(candidate_codes)

        user_tensor = torch.tensor([user_id] * num_candidates, dtype=torch.long)
        games_tensor = torch.tensor(candidate_codes, dtype=torch.long)

        if self._game_code_to_tags:
            tags_tensor = torch.stack(
                [self._game_code_to_tags[c] for c in candidate_codes]
            )
        else:
            tags_tensor = torch.zeros(num_candidates, self.total_tags)

        with torch.no_grad():
            scores = self.model(user_tensor, games_tensor, tags_tensor).squeeze()

        top_k = min(top_k, num_candidates)
        top_scores, top_indices = torch.topk(scores, k=top_k)

        return [
            (candidate_pks[idx.item()], round(top_scores[rank].item(), 4))
            for rank, idx in enumerate(top_indices)
        ]


_service_instance: RecomendationSystemService | None = None


def get_recomendation_service() -> RecomendationSystemService:
    global _service_instance
    if _service_instance is None:
        _service_instance = RecomendationSystemService()
    return _service_instance
