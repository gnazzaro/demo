import torch
from games.models import Game, Tag
from cart.models import Library


def content_based_similarity(target_game: Game, user):
    # Evaluate as a plain list so it is reusable without re-hitting the DB.
    all_tags = list(Tag.objects.values_list("name", flat=True).order_by("name"))
    all_tags_to_index = {tag: idx for idx, tag in enumerate(all_tags)}

    # Bug fix 1: tag_list.all() returns Tag *objects*, not strings.
    # Extracting .name from each Tag via a set gives O(1) string lookup and
    # correctly uses the prefetch cache when prefetch_related is active.
    target_tag_names = {t.name for t in target_game.tag_list.all()}
    target_tags = [1 if tag in target_tag_names else 0 for tag in all_tags]

    target_tags_tensor = torch.tensor(target_tags, dtype=torch.float32)

    not_owned_games = (
        Game.objects.distinct()
        .exclude(id=target_game.id)
        .prefetch_related("tag_list")
    )

    if user.is_authenticated:
        # Bug fix 2: Library.objects.filter(...) returns Library instances, not
        # game PKs. Passing that queryset to id__in compared Game.id against
        # Library.id, so the exclusion never worked.  We need the FK values.
        owned_game_ids = Library.objects.filter(user=user).values_list(
            "game_id", flat=True
        )
        not_owned_games = not_owned_games.exclude(id__in=owned_game_ids)

    # Materialise the queryset once so index-based access later is consistent.
    not_owned_games = list(not_owned_games)

    all_tags_per_game = []

    for game in not_owned_games:
        # Bug fix 3: same string-vs-object mismatch as above.
        # Building a set per game reuses the prefetch cache and avoids an O(n)
        # linear scan of the queryset for every tag.
        game_tag_names = {t.name for t in game.tag_list.all()}
        game_tags = [
            1 if all_tags[idx] in game_tag_names else 0
            for idx in range(len(all_tags))
        ]
        all_tags_per_game.append(game_tags)

    if not all_tags_per_game:
        return []

    all_tags_per_game_tensor = torch.tensor(all_tags_per_game, dtype=torch.float32)

    product = torch.mv(all_tags_per_game_tensor, target_tags_tensor)

    norm_target = torch.norm(target_tags_tensor)
    norm_games = torch.norm(all_tags_per_game_tensor, dim=1)
    norm = norm_target * norm_games

    cosine_similarities = product / (norm + 1e-8)

    top_k = min(10, len(not_owned_games))
    values, indices = torch.topk(cosine_similarities, top_k)

    most_similar_games = [not_owned_games[idx.item()] for idx in indices]
    return most_similar_games
