import { useState } from "react"

interface Props {
    onAdd: (title: string) => void
}

export default function AddCardForm({ onAdd }: Props) {
    const [title, setTitle] = useState("")
    const [open, setOpen] = useState(false)

    const submit = () => {
        if (!title.trim()) return;
        onAdd(title)
        setTitle("")
        setOpen(false)
    }

    if(!open) {
        return (
            <button type="button" onClick={() => setOpen(true)} className="text-sm text-gray-500 text-left hover:text-gray-700">
                + Add card
            </button>
        )
    }
  return (
    <div>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") setOpen(false);
      }} 
      className="border rounded px-2 py-1 text-sm"
      placeholder="Card title" />
      <div className="flex gap-2">
        <button type="button" onClick={submit} className="text-sm bg-black text-white rounded px-2 py-1">Add</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-500">Cancel</button>
      </div>
    </div>
  );
}
