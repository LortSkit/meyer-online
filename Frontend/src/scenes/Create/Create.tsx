import { Box } from "@mui/material";
import { useState } from "react";
import CreateHeading from "./CreateHeading";
import CreateNewGame from "./CreateNewGame/CreateNewGame";
import { Meyer } from "../../utils/gameLogic";
import InGame from "./InGame/InGame";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [canCreateNewGame, setCanCreateNewGame] = useState(true);
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [inGame, setInGame] = useState(false);
  const [meyer, setMeyer] = useState(null as unknown as Meyer);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <CreateHeading isDanish={isDanish} />

      {/* CREATE NEW GAME */}
      {canCreateNewGame && (
        <CreateNewGame
          isDanish={isDanish}
          numberOfPlayers={numberOfPlayers}
          setCanCreateNewGame={setCanCreateNewGame}
          setCurrentHealths={setCurrentHealths}
          setInGame={setInGame}
          setMeyer={setMeyer}
          setNumberOfPlayers={setNumberOfPlayers}
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
    </Box>
  );
};

export default Create;
