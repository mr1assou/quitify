import { memo, useCallback, useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { DraggableCigarette } from "@/components/feature/craving/games/drag-cigarettes/DraggableCigarette";
import { TrashBin } from "@/components/feature/craving/games/drag-cigarettes/TrashBin";
import { DRAG_CIGARETTES_TRASH_SIZE } from "@/constants/dragCigarettes";
import type { DragCigarette } from "@/hooks/useDragCigarettesGame";

type Props = {
  cigarettes: readonly DragCigarette[];
  trashed: number;
  onTrash: (id: string) => void;
};

const BOTTOM_PADDING = 20;

function DragPlayFieldImpl({ cigarettes, trashed, onTrash }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredIds, setHoveredIds] = useState<Set<string>>(() => new Set());

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (width !== size.width || height !== size.height) {
        setSize({ width, height });
      }
    },
    [size.width, size.height],
  );

  // Trash sits at the bottom-center. Computed once per layout change.
  const trashZone = useMemo(() => {
    if (size.width === 0 || size.height === 0) {
      return { centerX: 0, centerY: 0, radius: 0 };
    }
    const centerX = size.width / 2;
    const centerY =
      size.height - BOTTOM_PADDING - DRAG_CIGARETTES_TRASH_SIZE / 2;
    return {
      centerX,
      centerY,
      radius: DRAG_CIGARETTES_TRASH_SIZE / 2,
    };
  }, [size.width, size.height]);

  const handleHoverChange = useCallback((id: string, hovering: boolean) => {
    setHoveredIds((prev) => {
      const next = new Set(prev);
      if (hovering) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleTrash = useCallback(
    (id: string) => {
      onTrash(id);
      setHoveredIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [onTrash],
  );

  const trashActive = hoveredIds.size > 0;

  return (
    <View
      onLayout={handleLayout}
      className="mx-4 mb-4 mt-2 flex-1 overflow-hidden"
    >
      {size.width > 0 && size.height > 0 ? (
        <>
          {cigarettes.map((c) => (
            <DraggableCigarette
              key={c.id}
              cigarette={c}
              areaWidth={size.width}
              areaHeight={size.height}
              trashZone={trashZone}
              onTrash={handleTrash}
              onHoverChange={handleHoverChange}
            />
          ))}

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: trashZone.centerX - DRAG_CIGARETTES_TRASH_SIZE / 2,
              top: trashZone.centerY - DRAG_CIGARETTES_TRASH_SIZE / 2,
              width: DRAG_CIGARETTES_TRASH_SIZE,
              height: DRAG_CIGARETTES_TRASH_SIZE,
            }}
          >
            <TrashBin active={trashActive} pulseTick={trashed} />
          </View>
        </>
      ) : null}
    </View>
  );
}

export const DragPlayField = memo(DragPlayFieldImpl);
