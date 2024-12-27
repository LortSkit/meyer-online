import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { Meyer, Action } from "../../utils/gameLogic";
import { ChangeEvent, useState } from "react";
import { RollWithName } from "../../utils/diceUtils";

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
  const translateActions: { [action: string]: string } = {
    ["Check"]: isDanish ? "Tjek" : "Check",
    ["Roll"]: isDanish ? "Rul" : "Roll",
    ["Truth"]: isDanish ? "Sandhed" : "Truth",
    ["Bluff"]: isDanish ? "Bluf" : "Bluff",
    ["SameRollOrHigher"]: isDanish
      ? "Det eller derover"
      : "Same roll or higher",
  };
  const actions = (roll: number) =>
    roll == 32 ? [isDanish ? "SKÅL!" : "CHEERS!"] : meyer.getActionChoices();
  const choices = actions(meyer.getRoll()).map((action) => (
    <Box
      display="flex"
      flexBasis={`${100 / meyer.getActionChoices().length}%`}
      justifyContent="center"
      key={action}
    >
      <Box display="flex" justifyContent="center" bgcolor={colors.primary[700]}>
        <IconButton
          onClick={() => {
            meyer.getRoll() != 32
              ? setChosenAction(action as Action)
              : undefined;
            let justnowPlayer = meyer.getCurrentPlayer();
            meyer.getRoll() != 32
              ? meyer.takeAction(action as Action)
              : undefined;
            meyer.advanceTurn();
            if (justnowPlayer != meyer.getCurrentPlayer()) {
              setChosenAction("Error");
            }
          }}
        >
          <Typography
            fontSize="20px"
            children={translateActions[action as string]}
          />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center" />
    </Box>
  ));

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
      {/* GAME LOGIC */}
      {/* TODO: MOVE LATER */}
      {/* TODO: MAKE LANGUAGE WORK ON IT */}
      {canStartNewGame && (
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <Box display="flex" justifyContent="center" flexBasis="30%">
              {isDanish ? "Antallet af spillere:" : "Number of players:"}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexBasis="10%"
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
          <Box bgcolor={colors.primary[700]}>
            <IconButton
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
            </IconButton>
          </Box>
        )}
        {inGame && (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Box display="flex" justifyContent="center" flexDirection="column">
              <Typography
                fontSize="30px"
                display="flex"
                justifyContent="center"
                children={
                  isDanish
                    ? `Runde ${meyer.getRound()}, tur ${meyer.getTurn()}`
                    : `Round ${meyer.getRound()}, turn ${meyer.getTurn()}`
                }
              />
              <Typography
                fontSize="20px"
                display="flex"
                justifyContent="center"
                children={
                  isDanish
                    ? `Spiller ${meyer.getCurrentPlayer()}'s tur`
                    : `Player ${meyer.getCurrentPlayer()}'s turn`
                }
              />
            </Box>
            {chosenAction == "Error" && (
              <Box display="flex" justifyContent="center">
                {choices}
              </Box>
            )}
            {chosenAction != "Error" && (
              <Box display="flex" flexDirection="column">
                <RollWithName
                  roll={meyer.getRoll()}
                  color={colors.blueAccent[100]}
                  sideLength={12}
                />
                <Box display="flex" justifyContent="center">
                  {choices}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Create;
