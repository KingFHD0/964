"use client";

import { useLocalStorage } from "@/lib/hooks";

const KEY = "aether.favorites.v1";

export function useFavorites() {
  const [ids, setIds] = useLocalStorage<string[]>(KEY, []);
  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const add = (id: string) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));
  return { ids, has, toggle, add, remove };
}
