"use client";

import { useReducer, useEffect, useState, useMemo } from "react";
import { boardReducer } from "@/lib/boardReducer";
import { loadInitialBoard } from "@/lib/boardStorage";
import { cardMatches } from "@/lib/matching";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useBoardPersistence } from "@/hooks/useBoardPersistence";
import { useKeyboardMove } from "@/hooks/useKeyboardMove";
import Column from "./Column";
import AddColumnForm from "./AddColumnForm";
import UndoRedoControls from "./UndoRedoControls";
import LiveRegion from "./LiveRegion";
import FilterBar from "./FilterBar";

export default function Board() {
  const [board, dispatch] = useReducer(
    boardReducer,
    undefined,
    loadInitialBoard,
  );
  const { dragState, startDrag, endDrag, setHover, clearHover } =
    useDragAndDrop();
  const { announcement } = useKeyboardMove(board, dispatch);

  const [search, setSearch] = useState("");
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  useBoardPersistence(board);

  const canUndo = board.history.past.length > 0;
  const canRedo = board.history.future.length > 0;
  const filterActive = search.trim() !== "" || activeLabel !== null;

  const matchMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const cardId of Object.keys(board.cards)) {
      map[cardId] = cardMatches(board.cards[cardId], search, activeLabel);
    }
    return map;
  }, [board.cards, search, activeLabel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) {
        dispatch({ type: "REDO" });
      } else {
        dispatch({ type: "UNDO" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDrop = (toColumnId: string) => {
    const { draggedCardId, draggedFromColumnId, hoveredIndex } = dragState;
    if (!draggedCardId || !draggedFromColumnId) return;

    const toColumn = board.columns[toColumnId];
    const toIndex = hoveredIndex ?? toColumn.cardIds.length;

    dispatch({
      type: "MOVE_CARD",
      cardId: draggedCardId,
      fromColumnId: draggedFromColumnId,
      toColumnId,
      toIndex,
    });

    endDrag();
  };

  return (
    <div className="h-screen flex flex-col">
      <LiveRegion message={announcement} />
      <header className="px-4 py-3 border-b bg-white shrink-0 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-semibold text-lg shrink-0">Kanban Board</h1>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          activeLabel={activeLabel}
          onLabelChange={setActiveLabel}
        />
        <UndoRedoControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => dispatch({ type: "UNDO" })}
          onRedo={() => dispatch({ type: "REDO" })}
        />
      </header>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 items-start h-full min-w-fit">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const cards = column.cardIds.map((cardId) => board.cards[cardId]);
            return (
              <Column
                key={column.id}
                column={column}
                cards={cards}
                matchMap={matchMap}
                filterActive={filterActive}
                isDragging={dragState.draggedCardId !== null}
                hoveredColumnId={dragState.hoveredColumnId}
                hoveredIndex={dragState.hoveredIndex}
                onAddCard={(title) =>
                  dispatch({ type: "ADD_CARD", columnId: column.id, title })
                }
                onEditCard={(cardId, changes) =>
                  dispatch({ type: "EDIT_CARD", cardId, changes })
                }
                onDeleteCard={(cardId) =>
                  dispatch({ type: "DELETE_CARD", cardId, columnId: column.id })
                }
                onCardDragStart={(cardId) => startDrag(cardId, column.id)}
                onCardDragEnd={endDrag}
                onHoverIndex={setHover}
                onClearHover={clearHover}
                onDropCard={handleDrop}
                onSetWipLimit={(limit) =>
                  dispatch({
                    type: "SET_WIP_LIMIT",
                    columnId: column.id,
                    wipLimit: limit,
                  })
                }
              />
            );
          })}
          <AddColumnForm
            onAdd={(title) => dispatch({ type: "ADD_COLUMN", title })}
          />
        </div>
      </div>
    </div>
  );
}
