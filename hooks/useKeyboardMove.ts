import { useEffect, useRef, useState } from "react";
import { BoardState, BoardAction } from "@/lib/types";
import { findCardLocation } from "@/lib/boardQueries";

const ARROW_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function useKeyboardMove(
  board: BoardState,
  dispatch: React.Dispatch<BoardAction>,
) {
  const [announcement, setAnnouncement] = useState("");
  const pendingFocusCardId = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocusCardId.current) return;
    const el = document.querySelector<HTMLElement>(
      `[data-card-id="${pendingFocusCardId.current}"]`,
    );
    el?.focus();
    pendingFocusCardId.current = null;
  }, [board]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (!ARROW_KEYS.has(e.key)) return;

      const active = document.activeElement as HTMLElement | null;
      const cardId = active?.dataset.cardId;
      if (!cardId) return;

      const location = findCardLocation(board, cardId);
      if (!location) return;

      const { columnId, index } = location;
      const column = board.columns[columnId];
      const card = board.cards[cardId];

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const direction = e.key === "ArrowUp" ? -1 : 1;
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= column.cardIds.length) return;

        e.preventDefault();
        const toIndex = direction === -1 ? index - 1 : index + 2;

        dispatch({
          type: "MOVE_CARD",
          cardId,
          fromColumnId: columnId,
          toColumnId: columnId,
          toIndex,
        });
        pendingFocusCardId.current = cardId;
        setAnnouncement(
          `Moved "${card.title}" ${direction === -1 ? "up" : "down"} in ${column.title}, now position ${targetIndex + 1} of ${column.cardIds.length}.`,
        );
        return;
      }

      const direction = e.key === "ArrowLeft" ? -1 : 1;
      const colIndex = board.columnOrder.indexOf(columnId);
      const targetColIndex = colIndex + direction;
      if (targetColIndex < 0 || targetColIndex >= board.columnOrder.length)
        return;

      e.preventDefault();
      const targetColumnId = board.columnOrder[targetColIndex];
      const targetColumn = board.columns[targetColumnId];

      dispatch({
        type: "MOVE_CARD",
        cardId,
        fromColumnId: columnId,
        toColumnId: targetColumnId,
        toIndex: index,
      });
      pendingFocusCardId.current = cardId;
      setAnnouncement(`Moved "${card.title}" to ${targetColumn.title}.`);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, dispatch]);

  return { announcement };
}
