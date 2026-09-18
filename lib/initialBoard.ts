import { BoardState } from "./types";

export const initialBoard: BoardState = {
  version: 1,
  columnOrder: ["todo", "doing", "done"],
  columns: {
    todo: { id: "todo", title: "To Do", cardIds: ["c1", "c2"] },
    doing: { id: "doing", title: "In Progress", cardIds: [] },
    done: { id: "done", title: "Done", cardIds: ["c3"] },
  },
  cards: {
    c1: { id: "c1", title: "Set up project", description: "", label: null },
    c2: {
      id: "c2",
      title: "Design board layout",
      description: "",
      label: null,
    },
    c3: { id: "c3", title: "Write README", description: "", label: null },
  },
  history: {
    past: [],
    future: [],
  },
};
