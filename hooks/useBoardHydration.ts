import { useEffect } from "react";
import { BoardAction } from "@/lib/types";
import { readPersistedBoard } from "@/lib/boardStorage";

export function useBoardHydration(dispatch: React.Dispatch<BoardAction>) {
  useEffect(() => {
    const persisted = readPersistedBoard();
    if (persisted) {
      dispatch({ type: "HYDRATE_BOARD", snapshot: persisted });
    }
  }, []);
}
