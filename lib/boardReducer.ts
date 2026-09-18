import { BoardState, BoardAction, BoardSnapshot } from "./types";
import { reorderList } from "./reorder";

let idCounter = 0;
function makeId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

const MAX_HISTORY = 50;

function toSnapshot(state: BoardState): BoardSnapshot {
  const { history, ...snapshot } = state;
  return snapshot;
}

const UNDOABLE_TYPES = new Set([
  "ADD_CARD",
  "EDIT_CARD",
  "DELETE_CARD",
  "ADD_COLUMN",
  "MOVE_CARD",
  "SET_WIP_LIMIT",
]);

function applyAction(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_CARD": {
      const column = state.columns[action.columnId];
      if (!column) return state;

      const newCard = {
        id: makeId("card"),
        title: action.title.trim(),
        description: "",
        label: null,
      };
      if (!newCard.title) return state;

      return {
        ...state,
        cards: { ...state.cards, [newCard.id]: newCard },
        columns: {
          ...state.columns,
          [column.id]: { ...column, cardIds: [...column.cardIds, newCard.id] },
        },
      };
    }

    case "EDIT_CARD": {
      const card = state.cards[action.cardId];
      if (!card) return state;

      return {
        ...state,
        cards: { ...state.cards, [card.id]: { ...card, ...action.changes } },
      };
    }

    case "DELETE_CARD": {
      const column = state.columns[action.columnId];
      if (!column) return state;

      const { [action.cardId]: _removed, ...remainingCards } = state.cards;

      return {
        ...state,
        cards: remainingCards,
        columns: {
          ...state.columns,
          [column.id]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== action.cardId),
          },
        },
      };
    }

    case "ADD_COLUMN": {
      const title = action.title.trim();
      if (!title) return state;

      const newColumn = { id: makeId("col"), title, cardIds: [] };

      return {
        ...state,
        columnOrder: [...state.columnOrder, newColumn.id],
        columns: { ...state.columns, [newColumn.id]: newColumn },
      };
    }

    case "MOVE_CARD": {
      const { cardId, fromColumnId, toColumnId, toIndex } = action;
      const fromColumn = state.columns[fromColumnId];
      const toColumn = state.columns[toColumnId];
      if (!fromColumn || !toColumn) return state;

      if (fromColumnId === toColumnId) {
        if (!fromColumn.cardIds.includes(cardId)) return state;
        const reordered = reorderList(fromColumn.cardIds, cardId, toIndex);
        return {
          ...state,
          columns: {
            ...state.columns,
            [fromColumnId]: { ...fromColumn, cardIds: reordered },
          },
        };
      }

      if (!fromColumn.cardIds.includes(cardId)) return state;

      const sourceCardIds = fromColumn.cardIds.filter((id) => id !== cardId);
      const targetCardIds = reorderList(toColumn.cardIds, cardId, toIndex);

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumnId]: { ...fromColumn, cardIds: sourceCardIds },
          [toColumnId]: { ...toColumn, cardIds: targetCardIds },
        },
      };
    }

    case "SET_WIP_LIMIT": {
      const column = state.columns[action.columnId];
      if (!column) return state;

      return {
        ...state,
        columns: {
          ...state.columns,
          [action.columnId]: {
            ...column,
            wipLimit: action.wipLimit ?? undefined,
          },
        },
      };
    }

    default:
      return state;
  }
}

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
    if (action.type === "HYDRATE_BOARD") {
      return {
        ...action.snapshot,
        history: { past: [], future: [] },
      };
    }
  if (action.type === "UNDO") {
    const { past, future } = state.history;
    if (past.length === 0) return state;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const currentSnapshot = toSnapshot(state);

    return {
      ...previous,
      history: {
        past: newPast,
        future: [currentSnapshot, ...future].slice(0, MAX_HISTORY),
      },
    };
  }

  if (action.type === "REDO") {
    const { past, future } = state.history;
    if (future.length === 0) return state;

    const next = future[0];
    const newFuture = future.slice(1);
    const currentSnapshot = toSnapshot(state);

    return {
      ...next,
      history: {
        past: [...past, currentSnapshot].slice(-MAX_HISTORY),
        future: newFuture,
      },
    };
  }

  const nextState = applyAction(state, action);

  if (!UNDOABLE_TYPES.has(action.type) || nextState === state) {
    return nextState;
  }

  const currentSnapshot = toSnapshot(state);

  return {
    ...nextState,
    history: {
      past: [...state.history.past, currentSnapshot].slice(-MAX_HISTORY),
      future: [], 
    },
  };
}
