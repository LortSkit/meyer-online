import { Box, Button, Typography } from "@mui/material";
import { Meyer } from "../../../../utils/gameLogic";
import { Action, TurnInfo } from "../../../../utils/gameTypes";
import {
  translateEndGame,
  translatePlayAgain,
} from "../../../../utils/lang/Create/InGame/GameOver/langGameOverButtons";

interface Props {
  isDanish: boolean;
  meyer: Meyer;
  setActionChoices: React.Dispatch<React.SetStateAction<Action[]>>;
  setBluffs: React.Dispatch<React.SetStateAction<number[]>>;
  setCanCreateNewGame: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setInGame: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setMeyer: React.Dispatch<React.SetStateAction<Meyer>>;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
  setPreviousAction: React.Dispatch<React.SetStateAction<Action>>;
  setPreviousDeclaredRoll: React.Dispatch<React.SetStateAction<number>>;
  setPreviousPlayer: React.Dispatch<React.SetStateAction<number>>;
  setPreviousRoll: React.Dispatch<React.SetStateAction<number>>;
  setRoll: React.Dispatch<React.SetStateAction<number>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
  setTurn: React.Dispatch<React.SetStateAction<number>>;
  setTurnInformation: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
  setTurnsTotal: React.Dispatch<React.SetStateAction<number>>;
}

const GameOverButtons = ({
  isDanish,
  meyer,
  setActionChoices,
  setBluffs,
  setCanCreateNewGame,
  setCurrentHealths,
  setInGame,
  setIsGameOver,
  setMeyer,
  setNumberOfPlayers,
  setPreviousAction,
  setPreviousDeclaredRoll,
  setPreviousPlayer,
  setPreviousRoll,
  setRoll,
  setRound,
  setShowBluffs,
  setTurn,
  setTurnInformation,
  setTurnsTotal,
}: Props) => {
  function resetGame(): void {
    meyer.resetGame();
    setActionChoices(["Roll"] as Action[]);
    setBluffs([] as number[]);
    setCurrentHealths(meyer.getCurrentHealths());
    //setCurrentPlayer(currentPlayer); //winner gets to start next game
    setIsGameOver(false);
    setPreviousAction("Error");
    setPreviousDeclaredRoll(-1);
    setPreviousPlayer(-1);
    setPreviousRoll(-1);
    setRoll(-1);
    setRound(1);
    setShowBluffs(false);
    setTurn(1);
    setTurnInformation([] as TurnInfo[]);
    setTurnsTotal(1);
  }

  function endGame(): void {
    resetGame();
    setCanCreateNewGame(true);
    setInGame(false);
    setMeyer(null as unknown as Meyer);
    setNumberOfPlayers(-1);
  }
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="center">
        {/* PLAY AGAIN */}
        <Button variant="contained" color="secondary" onClick={resetGame}>
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translatePlayAgain(isDanish)}
          />
        </Button>
        <Box marginLeft="3px" />
        {/* END GAME */}
        <Button variant="contained" color="secondary" onClick={endGame}>
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateEndGame(isDanish)}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default GameOverButtons;
