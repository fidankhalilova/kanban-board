import { useState } from "react"

interface Props {
    onAdd: (title: string) => void
}

export default function AddColumnForm({ onAdd }: Props) {
    const [title, setTitle] = useState('')
    const [open, setOpen] = useState(false)

    const submit = () => {
        if (!title.trim()) return;
        onAdd(title);
        setTitle("");
        setOpen(false)
    }

    if(!open) {
        return (
            <button type="button" onClick={() => setOpen(true)} className="w-72 shrink-0 border-2 border-dashed rounded p-3 text-sm text-gray-500 h-fit">
                + Add Column
            </button>
        )
    }

  return (
    <div className="w-72 shrink-0 bg-gray-100 rounded p-3 flex flex-col gap-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        className="border rounded px-2 py-1 text-sm"
        placeholder="Column title"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          className="text-sm bg-black text-white rounded px-2 py-1"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
