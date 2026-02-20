import Box from "@mui/material/Box";
import { useGlobalContext } from "../../../contexts/Socket/SocketContext";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PlayerEntries from "./PlayerEntries";
import { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface Props {
  isDanish: boolean;
  currentName: (uid: string) => string;
  changingOwner: boolean;
  setChangingOwner: React.Dispatch<React.SetStateAction<boolean>>;
  reordering: boolean;
  setReordering: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerDisplay = ({
  isDanish,
  currentName,
  changingOwner,
  setChangingOwner,
  reordering,
  setReordering,
}: Props) => {
  const { SocketState, SocketDispatch } = useGlobalContext();
  const sensors = useSensors(useSensor(PointerSensor));

  const [items, setItems] = useState(SocketState.thisGame.gamePlayersOrder);
  const [globalIsDragging, setGlobalIsDragging] = useState(false);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id === over?.id) return;

    const originalPos = items.findIndex((value) => value === Number(active.id));
    const newPos = items.findIndex((value) => value === Number(over?.id));

    const newOrder = arrayMove(items, originalPos, newPos);
    SocketState.socket?.emit("change_order", newOrder);
    setItems(newOrder);
  }

  useEffect(() => {
    setItems(SocketState.thisGame.gamePlayersOrder);
  }, [SocketState.thisGame]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(event) => {
        setGlobalIsDragging(false);
        handleDragEnd(event);
      }}
      onDragStart={() => setGlobalIsDragging(true)}
    >
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
        width="273px"
        sx={{ touchAction: "none" }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((nameindex, index) => (
            <PlayerEntries
              isDanish={isDanish}
              nameindex={nameindex}
              index={index}
              currentName={currentName}
              changingOwner={changingOwner}
              setChangingOwner={setChangingOwner}
              reordering={reordering}
              setReordering={setReordering}
              items={items}
              globalIsDragging={globalIsDragging}
              key={index}
            />
          ))}
          <Box paddingBottom="2px" />
        </SortableContext>
      </Box>
    </DndContext>
  );
};

export default PlayerDisplay;
