export interface CardData {
  id: string;
  title: string;
  description: string;
  label: string | null;
}

export interface ColumnData {
  id: string;
  title: string;
  cardIds: string[];
  wipLimit?: number;
}

export interface BoardSnapshot {
  version: 1;
  columnOrder: string[];
  columns: Record<string, ColumnData>;
  cards: Record<string, CardData>;
}

export interface BoardState extends BoardSnapshot {
  history: {
    past: BoardSnapshot[];
    future: BoardSnapshot[];
  };
}

export type BoardAction =
  | { type: "ADD_CARD"; columnId: string; title: string }
  | {
      type: "EDIT_CARD";
      cardId: string;
      changes: Partial<Omit<CardData, "id">>;
    }
  | { type: "DELETE_CARD"; cardId: string; columnId: string }
  | { type: "ADD_COLUMN"; title: string }
  | {
      type: "MOVE_CARD";
      cardId: string;
      fromColumnId: string;
      toColumnId: string;
      toIndex: number;
    }
  | { type: "SET_WIP_LIMIT"; columnId: string; wipLimit: number | null }
  | { type: "HYDRATE_BOARD"; snapshot: BoardSnapshot }
  | { type: "UNDO" }
  | { type: "REDO" };