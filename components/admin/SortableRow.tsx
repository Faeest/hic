"use client";

import { Reorder, useDragControls } from "framer-motion";
import { DotsSixVertical } from "@phosphor-icons/react";

/**
 * One draggable row. Dragging starts only from the grip handle, so the arrow,
 * edit and delete buttons keep working as plain clicks.
 */
export function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={id}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.01, zIndex: 20 }}
      className="glass-panel flex items-center gap-3 rounded-sm p-4 sm:gap-4 sm:p-5"
    >
      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        aria-label="Geser untuk mengubah urutan"
        className="grid h-9 w-6 shrink-0 cursor-grab touch-none place-items-center rounded-sm text-ink-faint transition-colors hover:text-ember active:cursor-grabbing"
      >
        <DotsSixVertical size={18} weight="bold" />
      </button>
      {children}
    </Reorder.Item>
  );
}
