export function reorderList(
  cardIds: string[],
  cardId: string,
  insertBeforeIndex: number,
): string[] {
  const currentIndex = cardIds.indexOf(cardId);
  const withoutCard = cardIds.filter((id) => id !== cardId);

  let adjustedIndex = insertBeforeIndex;
  if (currentIndex !== -1 && currentIndex < insertBeforeIndex) {
    adjustedIndex -= 1;
  }

  const clamped = Math.max(0, Math.min(adjustedIndex, withoutCard.length));
  const result = [...withoutCard];
  result.splice(clamped, 0, cardId);
  return result;
}
