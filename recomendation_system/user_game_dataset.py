import torch
from torch.utils.data import Dataset


class UserGameInteractionDataset(Dataset):
    # Maximum value of _calc_interest(), used to normalize targets to [0, 1].
    # = w_lib + w_stars = 1 + 5 = 6
    MAX_INTEREST = 6.0

    def __init__(self, users_id, games_id, tags_per_game, stars, in_lib):
        self.users = torch.tensor(list(users_id), dtype=torch.long)
        self.games = torch.tensor(list(games_id), dtype=torch.long)
        self.targets = torch.tensor(
            [
                self._calc_interest(star=stars.iloc[i], in_lib=in_lib.iloc[i])
                for i in range(len(stars))
            ],
            dtype=torch.float32,
        )

        # BUG FIX: store tags aligned by sample index, NOT by game categorical code.
        # The old code used `game.item()` (categorical code) as the dict key, but the
        # dict was built from Series positions after shuffle — these two don't match,
        # so every sample received the tags of the wrong game.
        self.tags_per_sample = [
            torch.tensor(tags, dtype=torch.float32)
            for tags in tags_per_game
        ]

    @staticmethod
    def _calc_interest(star, in_lib, w_stars=5, w_lib=1):
        if star == 0 and in_lib == 0:
            return 0.0

        star = 3 if star == 0 else star
        norm_stars = (star - 1) / 4.0
        raw = (in_lib * w_lib) + (norm_stars * w_stars)
        # Normalize to [0, 1] so the model has a well-bounded regression target.
        return raw / (w_lib + w_stars)

    def __len__(self):
        return len(self.users)

    def __getitem__(self, index):
        user = self.users[index]
        game = self.games[index]
        tags = self.tags_per_sample[index]   # index-based, NOT game_id-based
        target = self.targets[index]

        return user, game, tags, target
