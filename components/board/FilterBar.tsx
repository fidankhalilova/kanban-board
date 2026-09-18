import { LABELS } from "@/lib/labels";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  activeLabel: string | null;
  onLabelChange: (labelId: string | null) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  activeLabel,
  onLabelChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search cards…"
        className="border rounded px-2 py-1 text-sm w-48"
      />
      <div className="flex gap-1 flex-wrap items-center">
        <button
          type="button"
          onClick={() => onLabelChange(null)}
          className={`text-xs px-2 py-1 rounded border ${
            activeLabel === null
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600"
          }`}
        >
          All
        </button>
        {LABELS.map((label) => (
          <button
            key={label.id}
            type="button"
            onClick={() =>
              onLabelChange(activeLabel === label.id ? null : label.id)
            }
            className={`text-xs px-2 py-1 rounded border ${label.classes} ${
              activeLabel === label.id
                ? "ring-2 ring-offset-1 ring-black/40"
                : ""
            }`}
          >
            {label.name}
          </button>
        ))}
      </div>
    </div>
  );
}
