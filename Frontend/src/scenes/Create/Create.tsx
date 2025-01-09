import { Box, Button, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Meyer, Action } from "../../utils/gameLogic";
import { ChangeEvent, useState } from "react";
import { RollWithName } from "../../utils/diceUtils";
import {
  ActionChoices,
  BluffChoices,
  Healths,
  TurnInfo,
  TurnInformation,
  TurnInfoToMessage,
} from "./GameElements";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [actionChoices, setActionChoices] = useState(["Roll"] as Action[]);
  const [bluffs, setBluffs] = useState([] as number[]);
  const [canStartNewGame, setCanStartNewGame] = useState(true);
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [inGame, setInGame] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [meyer, setMeyer] = useState(null as unknown as Meyer);
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [previousAction, setPreviousAction] = useState("Error" as Action); //TODO: MAKE TURNINFORMATION
  const [previousDeclaredRoll, setPreviousDeclaredRoll] = useState(-1); //TODO: MAKE TURNINFORMATION
  const [previousPlayer, setPreviousPlayer] = useState(-1); //TODO: MAKE TURNINFORMATION
  const [previousRoll, setPreviousRoll] = useState(-1); //TODO: MAKE TURNINFORMATION
  const [roll, setRoll] = useState(-1);
  const [round, setRound] = useState(1);
  const [showBluffs, setShowBluffs] = useState(false);
  const [turn, setTurn] = useState(1);
  const [turnInformation, setTurnInformation] = useState([] as TurnInfo[]); //TODO: MAKE TURNINFORMATION
  const [turnsTotal, setTurnsTotal] = useState(1);

  function onChange(event: ChangeEvent<HTMLInputElement>): void {
    setNumberOfPlayers(Number(event.target.value));
  }

  function onInput(event: ChangeEvent<HTMLInputElement>): void {
    Number(event.target.value) >= 10 && event.target.value.slice(0, 2) == "10"
      ? (event.target.value = "10")
      : (event.target.value = event.target.value.slice(
          event.target.value.length - 1,
          event.target.value.length
        ));
  }

  function createGame(): void {
    setCanStartNewGame(false);
    let meyerInstance = new Meyer(numberOfPlayers);
    setMeyer(meyerInstance);
    setInGame(true);
    setCurrentHealths(meyerInstance.getCurrentHealths());
  }

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
    setCanStartNewGame(true);
    setInGame(false);
    setMeyer(null as unknown as Meyer);
    setNumberOfPlayers(-1);
  }

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <Box display="flex" justifyContent="center">
        <Typography
          variant="h1"
          color={colors.blueAccent[100]}
          fontWeight="bold"
          children={isDanish ? "Opret et spil" : "Create a game"}
        />
      </Box>

      {/* START NEW GAME */}
      {canStartNewGame && (
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <Box display="flex" justifyContent="center">
              {isDanish ? "Antallet af spillere:" : "Number of players:"}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor={colors.primary[600]}
            >
              <InputBase
                id="num-players-bar"
                sx={{
                  ml: 1,
                  mr: 0,
                  color: colors.grey[400],
                }}
                type="number"
                required={true}
                inputProps={{
                  min: 2,
                  max: 10,
                  maxLength: 2,
                }}
                inputMode="tel"
                onChange={onChange}
                onInput={onInput}
              />
            </Box>
          </Box>
        </Box>
      )}
      <Box p={1} />
      <Box display="flex" justifyContent="center" flexBasis="100%">
        {canStartNewGame && (
          <Box bgcolor={colors.primary[700]} borderRadius="3px">
            <Button
              variant="contained"
              color="secondary"
              onClick={createGame}
              disabled={numberOfPlayers < 2 || numberOfPlayers > 10}
            >
              <Typography
                fontSize="20px"
                children={isDanish ? "Opret nyt spil!" : "Create new game!"}
              />
            </Button>
          </Box>
        )}

        {/* IN GAME */}
        {inGame && (
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
              {/* GAME HEADING */}
              {!isGameOver && (
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Typography
                    fontSize="30px"
                    display="flex"
                    justifyContent="center"
                    children={
                      isDanish
                        ? `Runde ${round}, tur ${turn}`
                        : `Round ${round}, turn ${turn}`
                    }
                  />
                  <Typography
                    fontSize="20px"
                    display="flex"
                    justifyContent="center"
                    children={
                      isDanish
                        ? `Spiller ${currentPlayer}'s tur`
                        : `Player ${currentPlayer}'s turn`
                    }
                  />
                </Box>
              )}
              {/* GAME OVER HEADING */}
              {isGameOver && (
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Typography
                    fontSize="30px"
                    display="flex"
                    justifyContent="center"
                    children={
                      isDanish
                        ? `Spiller ${currentPlayer} vandt!`
                        : `Player ${currentPlayer} won!`
                    }
                  />
                  <Typography
                    fontSize="20px"
                    display="flex"
                    justifyContent="center"
                    children={
                      isDanish
                        ? `Der blev spillet ${round - 1} runder, og ${
                            turnsTotal - 1
                          } ture i alt`
                        : `A total of ${round} rounds and ${
                            turnsTotal - 1
                          } turns were played`
                    }
                  />
                </Box>
              )}
              {/* ACTUAL GAME */}
              {!isGameOver && (
                <Box display="flex" flexDirection="column">
                  {roll != -1 && (
                    <RollWithName
                      roll={roll}
                      color={colors.blueAccent[100]}
                      sideLength={12}
                    />
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
              )}
              {/* GAME OVER - PLAY AGAIN AND END GAME BUTTON */}
              {isGameOver && (
                <Box display="flex" flexDirection="column">
                  <Box display="flex" justifyContent="center">
                    {/* PLAY AGAIN */}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={resetGame}
                    >
                      <Typography
                        fontSize="20px"
                        fontStyle="normal"
                        textTransform="none"
                        children={isDanish ? "Spil igen" : "Play again"}
                      />
                    </Button>
                    <Box marginLeft="3px" />
                    {/* END GAME */}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={endGame}
                    >
                      <Typography
                        fontSize="20px"
                        fontStyle="normal"
                        textTransform="none"
                        children={isDanish ? "Afslut spil" : "End game"}
                      />
                    </Button>
                  </Box>
                </Box>
              )}
              <Box p={1} />
              {/* TURN INFORMATION */}
              <TurnInformation
                isDanish={isDanish}
                turnInformation={turnInformation}
              />
            </Box>
            {/* HEALTH */}
            <Healths
              currentHealths={currentHealths}
              currentPlayer={currentPlayer}
              isGameOver={isGameOver}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Create;
