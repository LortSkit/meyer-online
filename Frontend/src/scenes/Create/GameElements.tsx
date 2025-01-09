import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Action, Meyer } from "../../utils/gameLogic";
import { tokens } from "../../theme";
import { Dice, RollWithName } from "../../utils/diceUtils";

interface ActionProps {
  isDanish: boolean;
  meyer: Meyer;
  actionChoices: Action[];
  setActionChoices: React.Dispatch<React.SetStateAction<Action[]>>;
  setBluffs: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentAction: React.Dispatch<React.SetStateAction<Action>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setRoll: React.Dispatch<React.SetStateAction<number>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
  setTurn: React.Dispatch<React.SetStateAction<number>>;
  setTurnsTotal: React.Dispatch<React.SetStateAction<number>>;
}

export const ActionChoices = ({
  isDanish,
  meyer,
  actionChoices,
  setActionChoices,
  setBluffs,
  setCurrentAction,
  setCurrentHealths,
  setCurrentPlayer,
  setIsGameOver,
  setRoll,
  setRound,
  setShowBluffs,
  setTurn,
  setTurnsTotal,
}: ActionProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const translateActions: { [action: string]: string } = {
    ["Error"]: isDanish ? "FEJL!" : "ERROR!",
    ["Check"]: isDanish ? "Tjek" : "Check",
    ["HealthRoll"]: isDanish ? "Rul nyt liv" : "Roll new health",
    ["Roll"]: isDanish ? "Rul" : "Roll",
    ["Cheers"]: isDanish ? "SKÅL!" : "CHEERS!",
    ["SameRollOrHigher"]: isDanish
      ? "Det eller derover"
      : "Same roll or higher",
    ["Truth"]: isDanish ? "Sandhed" : "Truth",
    ["Bluff"]: isDanish ? "Bluf" : "Bluff",
  };

  function endTurn(): void {
    setCurrentAction("Error");
    setRoll(-1);
    setTurn(meyer.getTurn());
    setTurnsTotal((t) => t + 1);
    setCurrentPlayer(meyer.getCurrentPlayer());
  }

  function endRound(): void {
    endTurn();
    setRound(meyer.getRound());
    setCurrentHealths(meyer.getCurrentHealths());
    if (meyer.isGameOver()) {
      setIsGameOver(true);
    }
  }

  const onClick = (action: Action) => () => {
    if (action != "Error") {
      meyer.takeAction(action);
      setCurrentAction(action);

      if (action != "Bluff") {
        meyer.advanceTurn();
      }
    }

    switch (action) {
      case "Error":
        break;

      case "Check":
        endRound();
        break;

      case "HealthRoll":
        endRound();
        break;

      case "Roll":
        setRoll(meyer.getRoll());
        break;

      case "Cheers":
        endRound();
        break;

      case "SameRollOrHigher":
        endTurn();
        break;

      case "Truth":
        endTurn();
        break;

      case "Bluff":
        setBluffs(meyer.getBluffChoices());
        setShowBluffs(true);
        break;
    }

    setActionChoices(meyer.getActionChoices());
  };

  const choices = actionChoices.map((action) => (
    <Box display="flex" justifyContent="center" key={action}>
      <Box
        display="flex"
        justifyContent="center"
        bgcolor={colors.primary[700]}
        borderRadius="3px"
      >
        <Button variant="contained" color="secondary" onClick={onClick(action)}>
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateActions[action as string]}
          />
        </Button>
      </Box>
      <Box marginLeft="3px" />
      <Box display="flex" justifyContent="center" />
    </Box>
  ));

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {choices}
    </Box>
  );
};

interface BluffProps {
  bluffs: number[];
  meyer: Meyer;
  setActionChoices: React.Dispatch<React.SetStateAction<Action[]>>;
  setCurrentAction: React.Dispatch<React.SetStateAction<Action>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setRoll: React.Dispatch<React.SetStateAction<number>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
  setTurn: React.Dispatch<React.SetStateAction<number>>;
  setTurnsTotal: React.Dispatch<React.SetStateAction<number>>;
}

export const BluffChoices = ({
  bluffs,
  meyer,
  setActionChoices,
  setCurrentAction,
  setCurrentPlayer,
  setRoll,
  setShowBluffs,
  setTurn,
  setTurnsTotal,
}: BluffProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function endTurn(): void {
    setCurrentAction("Error");
    setRoll(-1);
    setTurn(meyer.getTurn());
    setTurnsTotal((t) => t + 1);
    setCurrentPlayer(meyer.getCurrentPlayer());
  }

  const onClick = (bluff: number) => () => {
    meyer.chooseBluff(bluff);
    meyer.advanceTurn();
    setShowBluffs(false);
    setActionChoices(meyer.getActionChoices());
    endTurn();
  };

  const bluffChoices = bluffs.map((bluff) => (
    <Box
      display="flex"
      justifyContent="center"
      key={bluff}
      flexWrap="wrap"
      borderRadius="3px"
    >
      <Button variant="contained" color="secondary" onClick={onClick(bluff)}>
        <Typography
          fontSize="20px"
          fontStyle="normal"
          textTransform="none"
          component="span"
        >
          <RollWithName
            roll={bluff}
            color={colors.blueAccent[100]}
            sideLength={12}
          />
        </Typography>
      </Button>
      <Box marginLeft="3px" />
    </Box>
  ));
  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {bluffChoices}
    </Box>
  );
};

interface HealthsProps {
  currentHealths: number[];
  currentPlayer: number;
  isGameOver: boolean;
}

export const Healths = ({
  currentHealths,
  currentPlayer,
  isGameOver,
}: HealthsProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="flex-start" minWidth="17%">
      <Box display="flex" flexDirection="column">
        {currentHealths.map(
          (health, index) =>
            health > 0 && (
              <Box display="flex" key={index}>
                {currentPlayer == index + 1 && !isGameOver && (
                  <ArrowForwardOutlined />
                )}
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
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};
