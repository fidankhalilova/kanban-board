import { useState } from "react";

interface DragState {
  draggedCardId: string | null;
  draggedFromColumnId: string | null;
  hoveredColumnId: string | null;
  hoveredIndex: number | null;
}

const initialDragState: DragState = {
  draggedCardId: null,
  draggedFromColumnId: null,
  hoveredColumnId: null,
  hoveredIndex: null,
};

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  const startDrag = (cardId: string, fromColumnId: string) => {
    setDragState({
      ...initialDragState,
      draggedCardId: cardId,
      draggedFromColumnId: fromColumnId,
    });
  };

  const endDrag = () => {
    setDragState(initialDragState);
  };

  const setHover = (columnId: string, index: number) => {
    setDragState((prev) => {
      if (prev.hoveredColumnId === columnId && prev.hoveredIndex === index)
        return prev;
      return { ...prev, hoveredColumnId: columnId, hoveredIndex: index };
    });
  };

  const clearHover = (columnId: string) => {
    setDragState((prev) => {
      if (prev.hoveredColumnId !== columnId) return prev;
      return { ...prev, hoveredColumnId: null, hoveredIndex: null };
    });
  };

  return { dragState, startDrag, endDrag, setHover, clearHover };
}
