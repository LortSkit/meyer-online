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
}

const PlayerDisplay = ({
  currentName,
  changingOwner,
  setChangingOwner,
}: Props) => {
  const { SocketState, SocketDispatch } = useGlobalContext();

  const [tasks, setTasks] = useState([
    { id: 1, title: "Entry 1" },
    { id: 2, title: "Entry 2" },
    { id: 3, title: "Entry 3" },
  ]);
  const sensors = useSensors(useSensor(PointerSensor));

  const getTaskPos = (id: any) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);

      return arrayMove(tasks, originalPos, newPos);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      //onDragEnd={handleDragEnd}
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
              key={index}
            />
          ))}
          {/* {tasks.map((task) => (
            <Task key={task.id} id={task.id} />
          ))} */}
          <Box paddingBottom="2px" />
        </SortableContext>
      </Box>
    </DndContext>
  );
};

export default PlayerDisplay;
