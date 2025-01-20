import { Box } from "@mui/material";
import SetNumberOfPlayers from "./SetNumberOfPlayers";
import CreateNewGameButtons from "./CreateNewGameButtons";
import { Meyer } from "../../../utils/gameLogic";
import SocketContextComponent from "../../../contexts/Socket/SocketComponents";

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
    <Box>
      {/* INPUT BAR */}
      <SetNumberOfPlayers
        isDanish={isDanish}
        setNumberOfPlayers={setNumberOfPlayers}
      />
      <Box p={1} />
      <Box display="flex" justifyContent="center" flexBasis="100%">
        {/* BUTTON */}

        <CreateNewGameButtons
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
