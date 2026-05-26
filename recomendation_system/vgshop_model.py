import torch


class VgshopRCNeuralModel(torch.nn.Module):
    EMBED_SIZE = 64  # Reduced from 128: fewer params → less overfitting for small datasets

    def __init__(self, num_users, num_games, num_tags):
        super().__init__()

        self.user_embed = torch.nn.Embedding(num_users, self.EMBED_SIZE)
        self.game_embed = torch.nn.Embedding(num_games, self.EMBED_SIZE)

        # +1 for the dot-product interaction scalar
        initial_tensor_size = self.EMBED_SIZE * 2 + num_tags + 1

        self.network = torch.nn.Sequential(
            torch.nn.Linear(initial_tensor_size, 256),
            torch.nn.BatchNorm1d(256),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.3),

            torch.nn.Linear(256, 128),
            torch.nn.BatchNorm1d(128),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.3),

            torch.nn.Linear(128, 64),
            torch.nn.BatchNorm1d(64),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.2),

            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),

            torch.nn.Linear(32, 1),
            # Sigmoid restituisce un numero CONTINUO in (0, 1), non binario.
            # BCELoss è solo la funzione di costo del training — non cambia il tipo
            # di output. Lo score è un grado di interesse e può essere usato per ranking.
            torch.nn.Sigmoid(),
        )

        self._init_embeddings()

    def _init_embeddings(self):
        torch.nn.init.xavier_uniform_(self.user_embed.weight)
        torch.nn.init.xavier_uniform_(self.game_embed.weight)

    def forward(self, user_ids, game_ids, tags_per_game):
        user_embed_vector = self.user_embed(user_ids)
        game_embed_vector = self.game_embed(game_ids)

        interaction = torch.sum(
            user_embed_vector * game_embed_vector, dim=1, keepdim=True
        )
        super_vector = torch.cat(
            [user_embed_vector, game_embed_vector, interaction, tags_per_game], dim=1
        )

        return self.network(super_vector)

    @torch.no_grad()
    def recommend(
        self,
        user_id: int,
        candidate_game_ids: list,
        tags_tensor: torch.Tensor,
        top_k: int = 10,
    ) -> list:
        """
        Restituisce i top_k giochi ordinati per interesse predetto, score decrescente.

        Il Sigmoid produce uno score CONTINUO in (0, 1).
        BCELoss è solo la funzione di costo del training — non rende l'output binario.
        Più lo score è vicino a 1, più il modello ritiene che il gioco interessi all'utente.

        Parametri
        ----------
        user_id             : ID categorico dell'utente (intero)
        candidate_game_ids  : lista di ID categorici dei giochi da valutare
        tags_tensor         : Tensor [num_games, num_tags] — tag di ogni gioco candidato
        top_k               : numero di raccomandazioni da restituire (default 10)

        Ritorna
        -------
        Lista di tuple (game_id, score) ordinata per score decrescente.

        Esempio
        -------
        >>> top10 = model.recommend(user_id=3, candidate_game_ids=all_game_ids,
        ...                         tags_tensor=all_tags_tensor, top_k=10)
        >>> for game_id, score in top10:
        ...     print(f"Game {game_id}  →  interesse: {score:.3f}")
        Game 42  →  interesse: 0.921
        Game  7  →  interesse: 0.887
        ...
        """
        self.eval()

        num_games = len(candidate_game_ids)
        user_tensor = torch.tensor([user_id] * num_games, dtype=torch.long)
        games_tensor = torch.tensor(candidate_game_ids, dtype=torch.long)

        # scores: shape [num_games, 1] → squeeze → [num_games]
        scores = self.forward(user_tensor, games_tensor, tags_tensor).squeeze()

        top_k = min(top_k, num_games)
        top_scores, top_indices = torch.topk(scores, k=top_k)

        return [
            (candidate_game_ids[idx.item()], round(top_scores[rank].item(), 4))
            for rank, idx in enumerate(top_indices)
        ]
