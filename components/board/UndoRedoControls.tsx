interface Props {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="text-sm px-3 py-1.5 rounded border disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="text-sm px-3 py-1.5 rounded border disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Redo
      </button>
    </div>
  );
}
