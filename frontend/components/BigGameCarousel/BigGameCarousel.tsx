import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Game } from "../GameAddModal/GameAddModal";
import { Spinner } from "../ui/spinner";

interface Props {
  params: {
    games: Game[] | undefined;
    error: string;
    isLoading: boolean;
  };
}

export function BigGameCarousel({ params }: Props) {
  if (params.isLoading) return <Spinner />;
  if (params.error)
    return (
      <div className="text-center text-red-500">
        Errore nel caricamento dei giochi
      </div>
    );
  if (params.games?.length === 0) return <p>Nessun Gioco disponibile.</p>;

  return (
    <Carousel className="w-full max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg group">
      <CarouselContent>
        {params.games
          ?.filter((game): game is Game => !!game)
          .map((game: Game) => (
            <CarouselItem key={game.id}>
              <Card className="border-none rounded-none bg-zinc-950 text-white">
                <CardContent className="flex p-0" style={{ height: "420px" }}>
                  {/* Left 3/4 — main cover image */}
                  <div className="relative w-3/4 h-full flex-shrink-0">
                    <Image
                      src={game.cover}
                      alt={`Cover di ${game.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Right 1/4 — details panel */}
                  <div className="relative w-1/4 flex flex-col bg-zinc-900 border-l border-zinc-800">
                    {/* Thumbnail overlapping the main image */}
                    <div
                      className="absolute -left-20 top-6 w-[160px] aspect-video rounded-md overflow-hidden border-2 border-zinc-700 shadow-2xl z-10"
                    >
                      <Image
                        src={game.images[0]?.image || game.cover}
                        alt="Miniatura galleria"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Text content pushed down to leave room for the thumbnail */}
                    <div className="flex flex-col flex-1 justify-between p-5 pt-28">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold leading-snug line-clamp-2">
                          {game.title}
                        </h3>

                        <div className="flex flex-wrap gap-1">
                          {game.tag_list.slice(0, 3).map((tag) => (
                            <span
                              key={tag.name}
                              className="text-[10px] uppercase bg-zinc-800 px-2 py-0.5 rounded tracking-wide"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed">
                          {game.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-zinc-800">
                        <span className="text-xs text-zinc-500">
                          Rilascio:{" "}
                          {new Date(game.release_date).toLocaleDateString(
                            "it-IT"
                          )}
                        </span>
                        <span className="text-2xl font-bold text-green-400">
                          {game.price === 0
                            ? "Gratis"
                            : `${game.price.toFixed(2)} €`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}
