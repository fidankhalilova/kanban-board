import { getLabel } from "@/lib/labels";

interface Props {
  labelId: string | null;
}

export default function LabelBadge({ labelId }: Props) {
  const label = getLabel(labelId);
  if (!label) return null;

  return (
    <span
      className={`inline-block w-fit text-[10px] font-medium px-1.5 py-0.5 rounded border ${label.classes}`}
    >
      {label.name}
    </span>
  );
}
