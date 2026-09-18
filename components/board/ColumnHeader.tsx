import { useState } from "react";
import { ColumnData } from "@/lib/types";

interface Props {
  column: ColumnData;
  cardCount: number;
  onSetWipLimit: (limit: number | null) => void;
}

export default function ColumnHeader({
  column,
  cardCount,
  onSetWipLimit,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(column.wipLimit?.toString() ?? "");

  const isOverLimit =
    column.wipLimit !== undefined && cardCount > column.wipLimit;

  const save = () => {
    const parsed = parseInt(value, 10);
    onSetWipLimit(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between shrink-0 gap-2">
      <h2 className="font-semibold text-sm truncate">{column.title}</h2>
      {editing ? (
        <input
          autoFocus
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-14 border rounded px-1 py-0.5 text-xs shrink-0"
          placeholder="Limit"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Click to set a WIP limit"
          className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
            isOverLimit
              ? "bg-red-100 text-red-700 font-semibold"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          {column.wipLimit !== undefined
            ? `${cardCount}/${column.wipLimit}`
            : cardCount}
        </button>
      )}
    </div>
  );
}
