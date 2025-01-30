import { Box, Typography, useTheme } from "@mui/material";
import GameHeading from "./GameHeading";
import ActionChoices from "./ActionChoices";
import BluffChoices from "./BluffChoices";
import { RollWithName } from "../../../../../utils/diceUtils";
import { Meyer } from "../../../../../utils/gameLogic";
import { Action, TurnInfo } from "../../../../../utils/gameTypes";
import { tokens } from "../../../../../theme";

interface Props {
  isDanish: boolean;
  actionChoices: Action[];
  bluffs: number[];
  currentHealths: number[];
  currentPlayer: number;
  meyer: Meyer;
  previousAction: Action;
  previousDeclaredRoll: number;
  previousPlayer: number;
  previousRoll: number;
  roll: number;
  round: number;
  showBluffs: boolean;
  turn: number;
  setActionChoices: React.Dispatch<React.SetStateAction<Action[]>>;
  setBluffs: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
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

const Game = ({
  isDanish,
  actionChoices,
  bluffs,
  currentHealths,
  currentPlayer,
  meyer,
  previousAction,
  previousDeclaredRoll,
  previousPlayer,
  previousRoll,
  roll,
  round,
  showBluffs,
  turn,
  setActionChoices,
  setBluffs,
  setCurrentHealths,
  setCurrentPlayer,
  setIsGameOver,
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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" flexDirection="column">
      <GameHeading
        isDanish={isDanish}
        currentPlayer={currentPlayer}
        round={round}
        turn={turn}
      />
      {roll != -1 && (
        <Typography
          fontSize="25px"
          fontStyle="normal"
          textTransform="none"
          component="span"
        >
          <RollWithName
            isDanish={isDanish}
            roll={roll}
            color={colors.blueAccent[100]}
            sideLength={30}
          />
        </Typography>
      )}
      {!showBluffs && (
        <ActionChoices
          isDanish={isDanish}
          actionChoices={actionChoices}
          currentHealths={currentHealths}
          currentPlayer={currentPlayer}
          meyer={meyer}
          previousAction={previousAction}
          previousPlayer={previousPlayer}
          previousDeclaredRoll={previousDeclaredRoll}
          previousRoll={previousRoll}
          roll={roll}
          setActionChoices={setActionChoices}
          setBluffs={setBluffs}
          setCurrentHealths={setCurrentHealths}
          setCurrentPlayer={setCurrentPlayer}
          setIsGameOver={setIsGameOver}
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
      )}
      {showBluffs && (
        <BluffChoices
          isDanish={isDanish}
          bluffs={bluffs}
          currentPlayer={currentPlayer}
          meyer={meyer}
          setActionChoices={setActionChoices}
          setCurrentPlayer={setCurrentPlayer}
          setPreviousAction={setPreviousAction}
          setPreviousDeclaredRoll={setPreviousDeclaredRoll}
          setPreviousPlayer={setPreviousPlayer}
          setRoll={setRoll}
          setShowBluffs={setShowBluffs}
          setTurn={setTurn}
          setTurnInformation={setTurnInformation}
          setTurnsTotal={setTurnsTotal}
        />
      )}
    </Box>
  );
};

export default Game;
