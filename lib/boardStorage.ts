import { BoardState, BoardSnapshot } from "./types";
import { initialBoard } from "./initialBoard";

const STORAGE_KEY = "kanbanBoard:v1";
const CURRENT_VERSION = 1;

function isValidSnapshot(data: unknown): data is BoardSnapshot {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  if (d.version !== CURRENT_VERSION) return false;
  if (!Array.isArray(d.columnOrder)) return false;
  if (typeof d.columns !== "object" || d.columns === null) return false;
  if (typeof d.cards !== "object" || d.cards === null) return false;

  const columns = d.columns as Record<string, unknown>;
  const cards = d.cards as Record<string, unknown>;

  for (const columnId of d.columnOrder as unknown[]) {
    if (typeof columnId !== "string") return false;
    const column = columns[columnId] as Record<string, unknown> | undefined;
    if (!column || !Array.isArray(column.cardIds)) return false;
    for (const cardId of column.cardIds as unknown[]) {
      if (typeof cardId !== "string") return false;
      if (!cards[cardId]) return false;
    }
  }

  return true;
}

export function readPersistedBoard(): BoardSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSnapshot(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writePersistedBoard(snapshot: BoardSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    console.log("Quota exceeded")
  }
}

export function clearPersistedBoard() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadInitialBoard(): BoardState {
  const persisted = readPersistedBoard();
  const snapshot = persisted ?? {
    version: initialBoard.version,
    columnOrder: initialBoard.columnOrder,
    columns: initialBoard.columns,
    cards: initialBoard.cards,
  };

  return {
    ...snapshot,
    history: { past: [], future: [] },
  };
}
