import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SetNumberOfPlayers from "../../../../components/game/SetNumberOfPlayers";
import CreateNewGameButton from "./CreateNewGameButton";
import { Meyer } from "../../../../utils/gameLogic";
import { translateNumberOfPlayers } from "../../../../utils/lang/Create/CreateLocal/CreateNewGame/langCreateNewGame";

interface Props {
  isDanish: boolean;
  numberOfPlayers: number;
  setCanCreateNewGame: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setInGame: React.Dispatch<React.SetStateAction<boolean>>;
  setMeyer: React.Dispatch<React.SetStateAction<Meyer>>;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const CreateNewGame = ({
  isDanish,
  numberOfPlayers,
  setCanCreateNewGame,
  setCurrentHealths,
  setInGame,
  setMeyer,
  setNumberOfPlayers,
}: Props) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box p={2} />
      {/* INPUT BAR */}
      <Box display="flex" justifyContent="center">
        <Typography
          fontSize="16px"
          children={translateNumberOfPlayers(isDanish)}
        />
        <SetNumberOfPlayers setNumberOfPlayers={setNumberOfPlayers} />
      </Box>
      <Box p={1} />
      <Box display="flex" justifyContent="center" flexBasis="100%">
        {/* BUTTON */}

        <CreateNewGameButton
          isDanish={isDanish}
          numberOfPlayers={numberOfPlayers}
          setCanCreateNewGame={setCanCreateNewGame}
          setCurrentHealths={setCurrentHealths}
          setInGame={setInGame}
          setMeyer={setMeyer}
        />
      </Box>
    </Box>
  );
};

export default CreateNewGame;
