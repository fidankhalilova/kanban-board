import { CardData } from "@/lib/types";
import { LABELS } from "@/lib/labels";
import LabelBadge from "@/components/ui/LabelBadge";
import { useState } from "react";

interface Props {
  card: CardData;
  isMatch: boolean;
  filterActive: boolean;
  onEdit: (changes: Partial<Omit<CardData, "id">>) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function Card({
  card,
  isMatch,
  filterActive,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [label, setLabel] = useState<string | null>(card.label);

  const save = () => {
    if (!title.trim()) return;
    onEdit({ title: title.trim(), description, label });
    setEditing(false);
  };

  const cancel = () => {
    setTitle(card.title);
    setDescription(card.description);
    setLabel(card.label);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-white border rounded p-3 shadow-sm flex flex-col gap-2">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-2 py-1 text-xs"
          rows={2}
          placeholder="Description (optional)"
        />
        <div className="flex gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setLabel(null)}
            className={`text-[10px] px-1.5 py-0.5 rounded border ${
              label === null
                ? "bg-black text-white border-black"
                : "bg-white text-gray-500"
            }`}
          >
            None
          </button>
          {LABELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLabel(l.id)}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${l.classes} ${
                label === l.id ? "ring-2 ring-offset-1 ring-black/40" : ""
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            className="text-xs bg-black text-white rounded px-2 py-1"
          >
            Save
          </button>
          <button
            type="button"
            onClick={cancel}
            className="text-xs text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const dimmed = filterActive && !isMatch;
  const highlighted = filterActive && isMatch;

  return (
    <div
      draggable
      data-card-id={card.id}
      tabIndex={0}
      aria-label={`${card.title}. Focused card. Hold Alt and press an arrow key to move it.`}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", card.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`bg-white border rounded p-3 shadow-sm flex flex-col gap-1 group cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity ${
        dimmed ? "opacity-30" : "opacity-100"
      } ${highlighted ? "ring-1 ring-yellow-400" : ""}`}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="font-medium text-sm">{card.title}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-gray-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <LabelBadge labelId={card.label} />
      {card.description && (
        <p className="text-xs text-gray-500">{card.description}</p>
      )}
    </div>
  );
}
