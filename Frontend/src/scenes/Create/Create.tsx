import { Box, Button, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Meyer, Action } from "../../utils/gameLogic";
import { ChangeEvent, useState } from "react";
import { RollWithName } from "../../utils/diceUtils";
import { Dice } from "../../utils/diceUtils";
import { ActionChoices, BluffChoices } from "./GameElements";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [numberOfPlayers, setNumberOfPlayers] = useState(-1);
  const [meyer, setMeyer] = useState(new Meyer(2)); //Temporary instance
  const [canStartNewGame, setCanStartNewGame] = useState(true);
  const [inGame, setInGame] = useState(false);
  const [chosenAction, setChosenAction] = useState("Error" as Action);
  const [showBluffs, setShowBluffs] = useState(false);
  const [bluffs, setBluffs] = useState([22]); //Temporary value
  const [roll, setRoll] = useState(-1);
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(1);
  const [currentHealths, setCurrentHealths] = useState([-1]); //Temporary value //TODO: Use this, but needs round loser
  const [currentPlayer, setCurrentPlayer] = useState(1); //TODO: Use this but needs nextplayer

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
      <Box display="flex" justifyContent="center" p={2}>
        <Typography
          variant="h1"
          color={colors.blueAccent[100]}
          fontWeight="bold"
          children={isDanish ? "Opret et spil" : "Start a game"}
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
      <Box display="flex" justifyContent="center">
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
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Box display="flex" justifyContent="center" flexDirection="column">
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
                  setCurrentPlayer={setCurrentPlayer}
                  setCurrentHealths={setCurrentHealths}
                  setChosenAction={setChosenAction}
                  setBluffs={setBluffs}
                  roll={roll}
                  setTurn={setTurn}
                  setRoll={setRoll}
                  setRound={setRound}
                  setShowBluffs={setShowBluffs}
                />
              )}
              {showBluffs && (
                <BluffChoices
                  bluffs={bluffs}
                  meyer={meyer}
                  setChosenAction={setChosenAction}
                  setShowBluffs={setShowBluffs}
                />
              )}
            </Box>
            {/* HEALTH */}
            <Box display="flex" justifyContent="center" flexDirection="column">
              <Box p={1} />
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="row"
                flexWrap="wrap"
              >
                {meyer.getCurrentHealths().map((health, index) => (
                  <Box display="flex" key={index}>
                    <Typography
                      display="flex"
                      fontSize="14px"
                      children={`Player ${index + 1}: `}
                    />
                    <Box marginRight="3px" />
                    <Dice
                      eyes={health}
                      color={colors.blueAccent[100]}
                      sideLength={20}
                    />
                    <Box p={1} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Create;
