"use client";
import useSWR from "swr";
import Link from "next/link";

interface TitlesResponse {
  titles: string[];
}

export default function LibraryButton() {
  const { data, error, isLoading } = useSWR<TitlesResponse>(
    "/library/list_titles"
  );

  if (error || isLoading) return null;

  const title = data?.titles?.[0] ?? null;

  if (!title) return null;

  return <Link href={`/library/${title}`}>Libreria</Link>;
}
