import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CreateHeading from "./CreateHeading";
import CreateNewGame from "./CreateNewGame/CreateNewGame";
import { Meyer } from "../../utils/gameLogic";
import InGame from "./InGame/InGame";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import SocketContextComponent from "../../contexts/Socket/SocketComponents";
import CenteredPage from "../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [canCreateNewGame, setCanCreateNewGame] = useState(true);
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [inGame, setInGame] = useState(false);
  const [meyer, setMeyer] = useState(null as unknown as Meyer);

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_create", SocketState.uid);
    }
  }, [SocketState.uid]);

  return (
    <>
      {canCreateNewGame && (
        <CenteredPage
          middleChild={
            <Box display="flex" flexBasis="100%" flexDirection="column">
              {/* HEADING */}
              <CreateHeading isDanish={isDanish} />

              {/* CREATE NEW LOCAL GAME */}
              <CreateNewGame
                isDanish={isDanish}
                numberOfPlayers={numberOfPlayers}
                setCanCreateNewGame={setCanCreateNewGame}
                setCurrentHealths={setCurrentHealths}
                setInGame={setInGame}
                setMeyer={setMeyer}
                setNumberOfPlayers={setNumberOfPlayers}
              />
            </Box>
          }
          leftWidthPercentage={5}
          middleWidthPercentage={90}
          rightWidthPercentage={5}
        />
      )}

      {/* IN GAME */}

      {inGame && (
        <InGame
          isDanish={isDanish}
          currentHealths={currentHealths}
          meyer={meyer}
          setCanCreateNewGame={setCanCreateNewGame}
          setCurrentHealths={setCurrentHealths}
          setInGame={setInGame}
          setMeyer={setMeyer}
          setNumberOfPlayers={setNumberOfPlayers}
        />
      )}
    </>
  );
};

export default Create;
