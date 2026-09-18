import { BoardState } from "./types";

export function findCardLocation(
  board: BoardState,
  cardId: string,
): { columnId: string; index: number } | null {
  for (const columnId of board.columnOrder) {
    const column = board.columns[columnId];
    const index = column.cardIds.indexOf(cardId);
    if (index !== -1) return { columnId, index };
  }
  return null;
}
