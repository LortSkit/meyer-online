import { Box } from "@mui/material";
import Game from "./Game/Game";
import GameOver from "./GameOver/GameOver";
import TurnInformation from "./TurnInformation";
import PlayerHealths from "./PlayerHealths";
import { Meyer } from "../../../utils/gameLogic";
import { Action, TurnInfo } from "../../../utils/gameTypes";
import { useState } from "react";

interface Props {
  isDanish: boolean;
  currentHealths: number[];
  meyer: Meyer;
  setCanCreateNewGame: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setInGame: React.Dispatch<React.SetStateAction<boolean>>;
  setMeyer: React.Dispatch<React.SetStateAction<Meyer>>;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const InGame = ({
  isDanish,
  currentHealths,
  meyer,
  setCanCreateNewGame,
  setCurrentHealths,
  setInGame,
  setMeyer,
  setNumberOfPlayers,
}: Props) => {
  const [actionChoices, setActionChoices] = useState(["Roll"] as Action[]);
  const [bluffs, setBluffs] = useState([] as number[]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [previousAction, setPreviousAction] = useState("Error" as Action);
  const [previousDeclaredRoll, setPreviousDeclaredRoll] = useState(-1);
  const [previousPlayer, setPreviousPlayer] = useState(-1);
  const [previousRoll, setPreviousRoll] = useState(-1);
  const [roll, setRoll] = useState(-1);
  const [round, setRound] = useState(1);
  const [showBluffs, setShowBluffs] = useState(false);
  const [turn, setTurn] = useState(1);
  const [turnInformation, setTurnInformation] = useState([] as TurnInfo[]);
  const [turnsTotal, setTurnsTotal] = useState(1);

  return (
    <Box display="flex" justifyContent="center" flexBasis="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexBasis="100%"
      >
        <Box display="flex" minWidth="21%" />
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          maxWidth="48%"
        >
          {/* GAME */}
          {!isGameOver && (
            <Game
              isDanish={isDanish}
              actionChoices={actionChoices}
              bluffs={bluffs}
              currentHealths={currentHealths}
              currentPlayer={currentPlayer}
              meyer={meyer}
              previousAction={previousAction}
              previousPlayer={previousPlayer}
              previousDeclaredRoll={previousDeclaredRoll}
              previousRoll={previousRoll}
              roll={roll}
              round={round}
              showBluffs={showBluffs}
              turn={turn}
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
          {/* GAME OVER */}
          {isGameOver && (
            <GameOver
              isDanish={isDanish}
              currentPlayer={currentPlayer}
              meyer={meyer}
              round={round}
              turnsTotal={turnsTotal}
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
          )}
          <Box p={1} />
          {/* TURN INFORMATION */}
          <TurnInformation
            isDanish={isDanish}
            turnInformation={turnInformation}
          />
        </Box>
        {/* HEALTH */}
        <PlayerHealths
          isDanish={isDanish}
          currentHealths={currentHealths}
          currentPlayer={currentPlayer}
          isGameOver={isGameOver}
        />
      </Box>
    </Box>
  );
};

export default InGame;
