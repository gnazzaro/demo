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

        # weights_only=False è necessario perché i checkpoint salvati con versioni
        # precedenti del training contengono tipi non-tensor (QuerySet, dizionari).
        # Usare solo con file prodotti dal proprio training — non con file di terzi.
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

    def predict_score(self, user, game, game_tags):
        user_id = self.map_user_code.get(user, None)
        game_id = self.map_game_code.get(game, None)

        if user_id is None or game_id is None:
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
        user          : ID originale dell'utente (come nel DB)
        top_k         : numero di raccomandazioni
        exclude_games : ID originali dei giochi da escludere (es. già in libreria)

        Ritorna
        -------
        Lista di (game_original_id, score) ordinata per score decrescente.
        """
        user_id = self.map_user_code.get(user, None)
        if user_id is None:
            return []

        exclude_set = set(exclude_games or [])
        candidate_original_ids = [
            orig for orig in self.map_game_code if orig not in exclude_set
        ]
        candidate_codes = [self.map_game_code[orig] for orig in candidate_original_ids]
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
            (candidate_original_ids[idx.item()], round(top_scores[rank].item(), 4))
            for rank, idx in enumerate(top_indices)
        ]


# Singleton con lazy loading: il modello viene caricato una volta sola al primo
# utilizzo, non all'import. In questo modo Django si avvia normalmente anche se
# il modello non è ancora stato addestrato.
_service_instance: RecomendationSystemService | None = None


def get_recomendation_service() -> RecomendationSystemService:
    global _service_instance
    if _service_instance is None:
        _service_instance = RecomendationSystemService()
    return _service_instance
