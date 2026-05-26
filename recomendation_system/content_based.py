import torch
from games.models import Game, Tag
from cart.models import Library


def content_based_similarity(target_game: Game, user):
    all_tags = list(Tag.objects.values_list("name", flat=True).order_by("name"))

    not_owned_games = (
        Game.objects.distinct()
        .exclude(id=target_game.id)
        .prefetch_related("tag_list")
    )

    if user.is_authenticated:
        owned_game_ids = Library.objects.filter(user=user).values_list(
            "game_id", flat=True
        )
        not_owned_games = not_owned_games.exclude(id__in=owned_game_ids)

    not_owned_games = list(not_owned_games)

    if not not_owned_games:
        return []

    # Build binary tag vectors for every candidate game.
    all_tags_per_game = []
    for game in not_owned_games:
        game_tag_names = {t.name for t in game.tag_list.all()}
        all_tags_per_game.append(
            [1 if tag in game_tag_names else 0 for tag in all_tags]
        )

    all_tags_per_game_tensor = torch.tensor(all_tags_per_game, dtype=torch.float32)

    target_tag_names = {t.name for t in target_game.tag_list.all()}
    target_tags_tensor = torch.tensor(
        [1 if tag in target_tag_names else 0 for tag in all_tags],
        dtype=torch.float32,
    )

    # IDF weighting — rare tags are more discriminative than common ones.
    #
    # Without this, a tag like "action" that appears in 80 % of the catalog
    # contributes as much to cosine similarity as a tag like "soulslike" that
    # appears in 2 % of games.  IDF down-weights frequent tags and up-weights
    # rare, specific ones, making the similarity score far more selective.
    #
    # Formula: idf(t) = log(N / (df(t) + 1))  clamped to 0 so tags present in
    # every candidate game contribute nothing rather than a tiny negative value.
    n = float(len(not_owned_games))
    df = all_tags_per_game_tensor.sum(dim=0)           # how many games have each tag
    idf = torch.clamp(torch.log(torch.tensor(n) / (df + 1.0)), min=0.0)

    # Apply IDF weights to both vectors before computing cosine similarity.
    weighted_target = target_tags_tensor * idf
    weighted_games = all_tags_per_game_tensor * idf.unsqueeze(0)

    product = torch.mv(weighted_games, weighted_target)

    norm_target = torch.norm(weighted_target)
    norm_games = torch.norm(weighted_games, dim=1)
    norm = norm_target * norm_games

    cosine_similarities = product / (norm + 1e-8)

    top_k = min(10, len(not_owned_games))
    values, indices = torch.topk(cosine_similarities, top_k)

    return [not_owned_games[idx.item()] for idx in indices]
