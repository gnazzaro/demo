import os
import torch
from django.conf import settings
from recomendation_system.vgshop_model import VgshopRCNeuralModel


class RecomendationSystemService:
    MODEL_DIR = settings.BASE_DIR / "recomendation_system/saved_models"
    MODEL_FILE = MODEL_DIR / "vgshop_model_trained.pt"

    def __init__(self):
        # BUG 1 FIX: MODEL_DIR è la cartella, torch.load vuole il FILE .pt
        if not os.path.exists(self.MODEL_FILE):
            raise FileNotFoundError("Modello non trovato, esegui il comando train !")

        complete_model = torch.load(self.MODEL_FILE, weights_only=False)
        self.map_user_code = complete_model["user_to_code"]
        self.map_game_code = complete_model["game_to_code"]
        self.total_tags = complete_model["total_tags"]
        self.all_tags = complete_model["all_tags"]

        self.model = VgshopRCNeuralModel(
            len(self.map_user_code), len(self.map_game_code), self.total_tags
        )
        # BUG 6 FIX (lato save_model): il checkpoint ora salva state_dict(),
        # quindi qui load_state_dict funziona correttamente.
        self.model.load_state_dict(complete_model["model"])
        self.model.eval()

        print("Modello pronto !")

    def predict_score(self, user, game, game_tags):
        user_id = self.map_user_code.get(user, None)
        game_id = self.map_game_code.get(game, None)

        # BUG 4 FIX: "not 0" è True in Python → l'utente/gioco con codice 0
        # restituiva sempre None. Usare "is None" è l'unico controllo corretto.
        if user_id is None or game_id is None:
            return None

        tag_list = [1 if tag in game_tags else 0 for tag in self.all_tags]

        # BUG 2+3 FIX: usare user_id e game_id (codici mappati), NON user e game
        #              che sono gli ID originali del DB — andrebbero fuori range.
        user_tensor = torch.tensor([user_id], dtype=torch.long)
        game_tensor = torch.tensor([game_id], dtype=torch.long)

        # BUG 5 FIX: i tag devono essere float32 — i layer lineari si aspettano float.
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
            orig for orig in self.map_game_code
            if orig not in exclude_set
        ]
        candidate_codes = [self.map_game_code[orig] for orig in candidate_original_ids]

        # Recupera i tag dei giochi candidati dall'all_tags salvato
        # (richiede che il checkpoint includa anche _game_code_to_tags)
        game_tags_map = self.map_game_code.get("_game_code_to_tags", None)

        num_candidates = len(candidate_codes)
        user_tensor = torch.tensor([user_id] * num_candidates, dtype=torch.long)
        games_tensor = torch.tensor(candidate_codes, dtype=torch.long)

        with torch.no_grad():
            # Se i tag per gioco sono stati salvati nel checkpoint usali,
            # altrimenti usa zero-vector (tags non disponibili a inferenza)
            if game_tags_map is not None:
                tags_tensor = torch.stack([game_tags_map[c] for c in candidate_codes])
            else:
                tags_tensor = torch.zeros(num_candidates, self.total_tags)

            scores = self.model(user_tensor, games_tensor, tags_tensor).squeeze()

        top_k = min(top_k, num_candidates)
        top_scores, top_indices = torch.topk(scores, k=top_k)

        return [
            (candidate_original_ids[idx.item()], round(top_scores[rank].item(), 4))
            for rank, idx in enumerate(top_indices)
        ]
