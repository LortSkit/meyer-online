import { Box } from "@mui/material";
import GameOverHeading from "./GameOverHeading";
import GameOverButtons from "./GameOverButtons";
import { Meyer } from "../../../../../utils/gameLogic";
import { Action, TurnInfo } from "../../../../../utils/gameTypes";

interface Props {
  isDanish: boolean;
  currentPlayer: number;
  meyer: Meyer;
  round: number;
  turnsTotal: number;
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

const GameOver = ({
  isDanish,
  currentPlayer,
  meyer,
  round,
  turnsTotal,
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
  return (
    <Box display="flex" flexDirection="column">
      <GameOverHeading
        isDanish={isDanish}
        currentPlayer={currentPlayer}
        round={round}
        turnsTotal={turnsTotal}
      />
      <GameOverButtons
        isDanish={isDanish}
        meyer={meyer}
        setActionChoices={setActionChoices}
        setBluffs={setBluffs}
        setCanCreateNewGame={setCanCreateNewGame}
        setCurrentHealths={setCurrentHealths}
        setInGame={setInGame}
        setIsGameOver={setIsGameOver}
        setMeyer={setMeyer}
        setNumberOfPlayers={setNumberOfPlayers}
        setPreviousAction={setPreviousAction}
        setPreviousDeclaredRoll={setPreviousDeclaredRoll}
        setPreviousPlayer={setPreviousPlayer}
        setPreviousRoll={setPreviousRoll}
        setRoll={setRoll}
        setRound={setRound}
        setShowBluffs={setShowBluffs}
        setTurn={setTurn}
        setTurnInformation={setTurnInformation}
        setTurnsTotal={setTurnsTotal}
      />
    </Box>
  );
};

export default GameOver;
