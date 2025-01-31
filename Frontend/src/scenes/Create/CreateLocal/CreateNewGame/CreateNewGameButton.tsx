import { Box, Button, Typography } from "@mui/material";
import { Meyer } from "../../../../utils/gameLogic";
import { translateCreateNewGame } from "../../../../utils/lang/Create/CreateLocal/CreateNewGame/langCreateNewGameButton";

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
  function onClickLocal(): void {
    setCanCreateNewGame(false);
    let meyerInstance = new Meyer(numberOfPlayers);
    setMeyer(meyerInstance);
    setInGame(true);
    setCurrentHealths(meyerInstance.getCurrentHealths());
  }

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {/* LOCAL */}
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickLocal}
          disabled={numberOfPlayers < 2 || numberOfPlayers > 20}
        >
          <Typography
            fontSize="20px"
            children={translateCreateNewGame(isDanish)}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default CreateNewGameButton;
