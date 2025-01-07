import { Box, Button, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Meyer, Action } from "../../utils/gameLogic";
import { ChangeEvent, useState } from "react";
import { RollWithName } from "../../utils/diceUtils";
import { Dice } from "../../utils/diceUtils";
import { ActionChoices, BluffChoices, Healths } from "./GameElements";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [actionChoices, setActionChoices] = useState(["Roll"] as Action[]);
  const [bluffs, setBluffs] = useState([] as number[]);
  const [canStartNewGame, setCanStartNewGame] = useState(true);
  const [chosenAction, setChosenAction] = useState("Error" as Action);
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [inGame, setInGame] = useState(false);
  const [meyer, setMeyer] = useState(null as unknown as Meyer);
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [roll, setRoll] = useState(-1);
  const [round, setRound] = useState(1);
  const [showBluffs, setShowBluffs] = useState(false);
  const [turn, setTurn] = useState(1);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberOfPlayers(Number(event.target.value));
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    Number(event.target.value) == 10;
    Number(event.target.value) >= 10 && event.target.value.slice(0, 2) == "10"
      ? (event.target.value = "10")
      : (event.target.value = event.target.value.slice(
          event.target.value.length - 1,
          event.target.value.length
        ));
  };

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
      {/* INTRODUCTION */}
      {/* TODO: WRITE IT */}

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
              onClick={() => {
                setCanStartNewGame(false);
                setMeyer(new Meyer(numberOfPlayers));
                setInGame(true);
              }}
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
            <Box display="flex" minWidth="17%" />
            <Box display="flex" justifyContent="center" flexDirection="column">
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
                    meyer={meyer}
                    actionChoices={actionChoices}
                    setActionChoices={setActionChoices}
                    setBluffs={setBluffs}
                    setChosenAction={setChosenAction}
                    setCurrentHealths={setCurrentHealths}
                    setCurrentPlayer={setCurrentPlayer}
                    setRoll={setRoll}
                    setRound={setRound}
                    setShowBluffs={setShowBluffs}
                    setTurn={setTurn}
                  />
                )}
                {showBluffs && (
                  <BluffChoices
                    bluffs={bluffs}
                    meyer={meyer}
                    setActionChoices={setActionChoices}
                    setChosenAction={setChosenAction}
                    setCurrentPlayer={setCurrentPlayer}
                    setRoll={setRoll}
                    setTurn={setTurn}
                    setShowBluffs={setShowBluffs}
                  />
                )}
              </Box>
              <Box p={1} />
              <Box display="flex" justifyContent="center">
                <Box display="flex" flexDirection="column">
                  {meyer.getTurnTable().map((value: string, index: number) => (
                    <Box key={index} display="flex" justifyContent="center">
                      {value}
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* HEALTH */}
            </Box>
            <Healths meyer={meyer} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Create;
