# Kanban Board

A drag-and-drop Kanban board built with Next.js, TypeScript, and Tailwind CSS.
Implements the HTML5 Drag and Drop API from scratch (no dnd libraries), with
all state managed through a single `useReducer`.

## Features

- Multi-column board, columns rendered from state (adding a column is a
  state change, not a JSX change)
- Card create, inline edit, and delete
- Native HTML5 drag-and-drop: cross-column moves and within-column reorder,
  with a live drop-position indicator
- Correct index handling on reorder (removing a card before inserting
  doesn't shift the drop target)
- Empty columns are valid drop targets
- `useReducer` with named actions (`MOVE_CARD`, `ADD_CARD`, `DELETE_CARD`,
  `EDIT_CARD`, `ADD_COLUMN`, `SET_WIP_LIMIT`), fully immutable — verified
  under React StrictMode
- `localStorage` persistence, versioned schema, defensive parsing (corrupt
  or missing data falls back to a default board)
- Undo/redo via a history stack in the reducer, plus `Cmd/Ctrl+Z` and
  `Cmd/Ctrl+Shift+Z`
- Keyboard-accessible moves: focus a card, `Alt+Arrow` to move it, announced
  via an `aria-live` region, with focus following the card
- Labels with colour coding, a search + label filter that dims
  non-matching cards without removing them from the DOM (so drag-and-drop
  keeps working)
- Per-column WIP limits with a visual warning when exceeded
- Responsive layout — columns scroll horizontally on narrow screens

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.