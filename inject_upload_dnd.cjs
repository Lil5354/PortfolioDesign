const fs = require('fs');

let content = fs.readFileSync('portfolio_system.jsx', 'utf8');

// Ensure verticalListSortingStrategy is imported
if (!content.includes('verticalListSortingStrategy')) {
    content = content.replace('rectSortingStrategy, useSortable } from \'@dnd-kit/sortable\';', 'rectSortingStrategy, verticalListSortingStrategy, useSortable } from \'@dnd-kit/sortable\';');
}

// 1. Add SortableUploadBlock component before UploadPage
const sortableBlockCode = `
const SortableUploadBlock = ({ block, children, removeBlock }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative',
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-4">
      <div 
        {...attributes} 
        {...listeners}
        className="w-8 flex-shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-[#999] hover:text-[#212121] bg-white border border-[#E0E0E0] rounded-lg mt-0 h-10 shadow-sm"
      >
        <GripVertical size={18} />
      </div>
      <div style={{ padding: 20, borderRadius: 12, border: \`1px solid \${GRAY_LIGHT}\`, background: "#fff", position: "relative", flex: 1 }} className={isDragging ? "shadow-lg ring-2 ring-[#1a4ba8]" : ""}>
        <div onClick={() => removeBlock(block.id)} style={{ position: "absolute", top: 12, right: 12, cursor: "pointer", color: CRIMSON, fontWeight: "bold" }}>×</div>
        {children}
      </div>
    </div>
  );
};
`;

if (!content.includes('const SortableUploadBlock =')) {
    const uploadPageIndex = content.indexOf('function UploadPage(');
    content = content.slice(0, uploadPageIndex) + sortableBlockCode + '\n' + content.slice(uploadPageIndex);
}

// 2. Wrap blocks in UploadPage with DndContext
const targetBlocksUI = `<div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
            {blocks.map((block, i) => (
              <div key={block.id} style={{ padding: 20, borderRadius: 12, border: \`1px solid \${GRAY_LIGHT}\`, background: "#fff", position: "relative" }}>
                <div onClick={() => removeBlock(block.id)} style={{ position: "absolute", top: 12, right: 12, cursor: "pointer", color: CRIMSON, fontWeight: "bold" }}>×</div>`;

const replaceBlocksUI = `
          <DndContext 
            sensors={useSensors(
              useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
              useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
            )}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                setBlocks((items) => {
                  const oldIndex = items.findIndex(i => i.id === active.id);
                  const newIndex = items.findIndex(i => i.id === over.id);
                  return arrayMove(items, oldIndex, newIndex);
                });
              }
            }}
          >
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
                {blocks.map((block, i) => (
                  <SortableUploadBlock key={block.id} block={block} removeBlock={removeBlock}>`;

content = content.replace(targetBlocksUI, replaceBlocksUI);

const targetBlocksUIEnd = `                  </div>
                )}
              </div>
            ))}`;

const replaceBlocksUIEnd = `                  </div>
                )}
                  </SortableUploadBlock>
            ))}`;

content = content.replace(targetBlocksUIEnd, replaceBlocksUIEnd);

const contextEndTarget = `</div>
          
          <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>Thêm khối nội dung:</h4>`;

const contextEndReplace = `</div>
            </SortableContext>
          </DndContext>
          
          <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>Thêm khối nội dung:</h4>`;

content = content.replace(contextEndTarget, contextEndReplace);

fs.writeFileSync('portfolio_system.jsx', content);
console.log("Successfully added drag and drop to UploadPage blocks");
