import { ColumnData, CardData } from "@/lib/types";
import Card from "./Card";
import AddCardForm from "./AddCardForm";
import DropIndicator from "./DropIndicator";
import ColumnHeader from "./ColumnHeader";

interface Props {
  column: ColumnData;
  cards: CardData[];
  matchMap: Record<string, boolean>;
  filterActive: boolean;
  isDragging: boolean;
  hoveredColumnId: string | null;
  hoveredIndex: number | null;
  onAddCard: (title: string) => void;
  onEditCard: (cardId: string, changes: Partial<Omit<CardData, "id">>) => void;
  onDeleteCard: (cardId: string) => void;
  onCardDragStart: (cardId: string) => void;
  onCardDragEnd: () => void;
  onHoverIndex: (columnId: string, index: number) => void;
  onClearHover: (columnId: string) => void;
  onDropCard: (toColumnId: string) => void;
  onSetWipLimit: (limit: number | null) => void;
}

export default function Column({
  column,
  cards,
  matchMap,
  filterActive,
  isDragging,
  hoveredColumnId,
  hoveredIndex,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardDragStart,
  onCardDragEnd,
  onHoverIndex,
  onClearHover,
  onDropCard,
  onSetWipLimit,
}: Props) {
  const isHoveringThisColumn = isDragging && hoveredColumnId === column.id;

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const midpointY = rect.top + rect.height / 2;
    const targetIndex = e.clientY > midpointY ? index + 1 : index;
    onHoverIndex(column.id, targetIndex);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onHoverIndex(column.id, cards.length);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      onClearHover(column.id);
    }
  };

  return (
    <div
      onDragOver={handleColumnDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDropCard(column.id);
      }}
      className="bg-gray-100 rounded p-3 w-72 shrink-0 flex flex-col gap-2 max-h-full"
    >
      <ColumnHeader
        column={column}
        cardCount={cards.length}
        onSetWipLimit={onSetWipLimit}
      />
      <div className="flex flex-col gap-2 min-h-24 overflow-y-auto">
        {cards.map((card, index) => (
          <div key={card.id} onDragOver={(e) => handleCardDragOver(e, index)}>
            {isHoveringThisColumn && hoveredIndex === index && (
              <DropIndicator />
            )}
            <Card
              card={card}
              isMatch={matchMap[card.id] ?? true}
              filterActive={filterActive}
              onEdit={(changes) => onEditCard(card.id, changes)}
              onDelete={() => onDeleteCard(card.id)}
              onDragStart={() => onCardDragStart(card.id)}
              onDragEnd={onCardDragEnd}
            />
          </div>
        ))}
        {isHoveringThisColumn && hoveredIndex === cards.length && (
          <DropIndicator />
        )}
      </div>
      <AddCardForm onAdd={onAddCard} />
    </div>
  );
}
