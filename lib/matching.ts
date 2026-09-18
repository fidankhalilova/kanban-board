import { CardData } from "./types";

export function cardMatches(
  card: CardData,
  search: string,
  activeLabel: string | null,
): boolean {
  if (activeLabel && card.label !== activeLabel) return false;

  const query = search.trim().toLowerCase();
  if (!query) return true;

  return (
    card.title.toLowerCase().includes(query) ||
    card.description.toLowerCase().includes(query)
  );
}
