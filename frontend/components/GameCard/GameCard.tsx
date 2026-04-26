import { Button } from "@/components/ui/button";
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
    <Card className="relative w-full aspect-[2/3] overflow-hidden p-0 border-zinc-800 bg-zinc-900 cursor-pointer group">
      {/* Cover a tutto schermo */}
      <div className="relative w-full h-full">
        <Image
          src={game.cover}
          alt={`Cover di ${game.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Gradient + info in basso */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pt-8 pb-3 flex flex-col gap-1">
        <span className="text-white text-sm font-semibold leading-tight line-clamp-2">
          {game.title}
        </span>
        <Button
          size="sm"
          disabled
          className="w-full mt-1 bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
        >
          {game.price === 0 ? "Gratis" : `${game.price.toFixed(2)} €`}
        </Button>
      </div>
    </Card>
  );
}
