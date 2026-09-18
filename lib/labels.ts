export const LABELS = [
  { id: "bug", name: "Bug", classes: "bg-red-100 text-red-700 border-red-300" },
  {
    id: "feature",
    name: "Feature",
    classes: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    id: "urgent",
    name: "Urgent",
    classes: "bg-orange-100 text-orange-700 border-orange-300",
  },
  {
    id: "chore",
    name: "Chore",
    classes: "bg-gray-100 text-gray-700 border-gray-300",
  },
  {
    id: "design",
    name: "Design",
    classes: "bg-purple-100 text-purple-700 border-purple-300",
  },
] as const;

export type LabelId = (typeof LABELS)[number]["id"];

export function getLabel(id: string | null) {
  if (!id) return null;
  return LABELS.find((l) => l.id === id) ?? null;
}
