import { useEffect, useRef } from "react";
import { BoardState } from "@/lib/types";
import { writePersistedBoard } from "@/lib/boardStorage";

export function useBoardPersistence(board: BoardState) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const { history, ...snapshot } = board;
      writePersistedBoard(snapshot);
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [board]);
}
