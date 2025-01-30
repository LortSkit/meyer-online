import { Box } from "@mui/material";
import { useState } from "react";
import CreateNewGame from "./CreateNewGame/CreateNewGame";
import { Meyer } from "../../../utils/gameLogic";
import InGame from "./InGame/InGame";
import CenteredPage from "../../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const CreateLocal = ({ isDanish }: Props) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [canCreateNewGame, setCanCreateNewGame] = useState(true);
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [inGame, setInGame] = useState(false);
  const [meyer, setMeyer] = useState(null as unknown as Meyer);

  return (
    <>
      {canCreateNewGame && (
        <CenteredPage
          middleChild={
            <Box display="flex" flexBasis="100%" flexDirection="column">
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

export default CreateLocal;
