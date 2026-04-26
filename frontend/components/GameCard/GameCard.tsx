import { Card } from "@/components/ui/card";
import { Game } from "../GameAddModal/GameAddModal";
import Image from "next/image";

interface Prop {
  params: {
    game: Game;
  };
}

export function GameCard({ params }: Prop) {
  const game = params.game;

  return (
    <Card
      className="relative w-full overflow-hidden p-0 border-zinc-800 bg-zinc-900 cursor-pointer group"
      style={{ aspectRatio: "2/3" }}
    >
      {/* Cover riempie tutta la card */}
      <Image
        src={game.cover}
        alt={`Cover di ${game.title}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Gradiente sottile solo in fondo, titolo sinistra e prezzo destra */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-3 pt-10 pb-3 flex items-end justify-between gap-2">
        <span className="text-white text-xs font-semibold leading-tight line-clamp-2 flex-1 min-w-0">
          {game.title}
        </span>
        <span className="text-green-400 text-xs font-bold whitespace-nowrap">
          {game.price === 0 ? "Gratis" : `${game.price.toFixed(2)} €`}
        </span>
      </div>
    </Card>
  );
}
