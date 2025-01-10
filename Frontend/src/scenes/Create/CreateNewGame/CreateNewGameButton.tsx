import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Meyer } from "../../../utils/gameLogic";
import { translateCreateNewGame } from "../../../utils/lang/Create/CreateNewGame/langCreateNewGameButton";

interface Props {
  isDanish: boolean;
  numberOfPlayers: number;
  setCanCreateNewGame: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setInGame: React.Dispatch<React.SetStateAction<boolean>>;
  setMeyer: React.Dispatch<React.SetStateAction<Meyer>>;
}

const CreateNewGameButton = ({
  isDanish,
  numberOfPlayers,
  setCanCreateNewGame,
  setCurrentHealths,
  setInGame,
  setMeyer,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function createGame(): void {
    setCanCreateNewGame(false);
    let meyerInstance = new Meyer(numberOfPlayers);
    setMeyer(meyerInstance);
    setInGame(true);
    setCurrentHealths(meyerInstance.getCurrentHealths());
  }
  return (
    <Box bgcolor={colors.primary[700]} borderRadius="3px">
      <Button
        variant="contained"
        color="secondary"
        onClick={createGame}
        disabled={numberOfPlayers < 2 || numberOfPlayers > 10}
      >
        <Typography
          fontSize="20px"
          children={translateCreateNewGame(isDanish)}
        />
      </Button>
    </Box>
  );
};

export default CreateNewGameButton;
