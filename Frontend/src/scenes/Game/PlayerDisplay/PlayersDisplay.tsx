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
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface Props {
  currentName: (uid: string) => string;
  changingOwner: boolean;
  setChangingOwner: React.Dispatch<React.SetStateAction<boolean>>;
  reordering: boolean;
  setReordering: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerDisplay = ({
  currentName,
  changingOwner,
  setChangingOwner,
  reordering,
  setReordering,
}: Props) => {
  const { SocketState, SocketDispatch } = useGlobalContext();
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = active.id - 1;
    const newPos = over.id - 1;

    const newOrder =
      originalPos < newPos
        ? arrayMove(SocketState.thisGame.gamePlayersOrder, originalPos, newPos)
        : arrayMove(SocketState.thisGame.gamePlayersOrder, newPos, originalPos);

    SocketState.socket?.emit("change_order", newOrder);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="wrap"
        width="273px"
        sx={{ touchAction: "none" }}
      >
        <SortableContext
          items={SocketState.thisGame.gamePlayersOrder}
          strategy={verticalListSortingStrategy}
        >
          {SocketState.thisGame.gamePlayersOrder.map((nameindex, index) => (
            <PlayerEntries
              nameindex={nameindex}
              index={index}
              currentName={currentName}
              changingOwner={changingOwner}
              setChangingOwner={setChangingOwner}
              reordering={reordering}
              setReordering={setReordering}
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
