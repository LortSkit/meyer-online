import { Box, Button, Typography, useTheme } from "@mui/material";
import { Action, Meyer } from "../../utils/gameLogic";
import { tokens } from "../../theme";
import { Dice, RollWithName } from "../../utils/diceUtils";
import { useEffect, useState } from "react";

interface ActionProps {
  isDanish: boolean;
  meyer: Meyer;
  setChosenAction: React.Dispatch<React.SetStateAction<Action>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setBluffs: React.Dispatch<React.SetStateAction<number[]>>;
  roll: number;
  setTurn: React.Dispatch<React.SetStateAction<number>>;
  setRoll: React.Dispatch<React.SetStateAction<number>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActionChoices = ({
  isDanish,
  meyer,
  setChosenAction,
  setCurrentHealths,
  setCurrentPlayer,
  setBluffs,
  roll,
  setTurn,
  setRoll,
  setRound,
  setShowBluffs,
}: ActionProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [actionChoices, setActionChoices] = useState(["Roll" as Action]); //Temporary value
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

  const onClick = (action: Action) => () => {
    let trueRoll = roll;
    if (action == "Roll") {
      trueRoll = meyer.getRoll();
      setRoll(trueRoll);
    }
    //Handles in-game actions
    setActionChoices(meyer.getActionChoices());
    if (action != "Error") {
      setChosenAction(action);
      meyer.takeAction(action);
    }
    if (action != "Bluff" && action != "Error") {
      meyer.advanceTurn();

      if (action == "Roll") {
        setRoll(meyer.getRoll());
      }
    } else if (action == "Bluff") {
      setBluffs(meyer.getBluffChoices());
      setShowBluffs(true);
    }
    setActionChoices(meyer.getActionChoices());
    if (
      action == "Check" ||
      action == "HealthRoll" ||
      action == "Cheers" ||
      action == "SameRollOrHigher" ||
      action == "Truth"
    ) {
      setTurn(meyer.getTurn());
      setChosenAction("Error");
      setRoll(-1);
    }
    if (action == "Check" || action == "Cheers" || action == "HealthRoll") {
      setRound(meyer.getRound());
      setCurrentHealths(meyer.getCurrentHealths());
    }
    setCurrentPlayer(meyer.getCurrentPlayer());
  };

  const choices = () => {
    useEffect(() => {
      setCurrentPlayer(() => meyer.getCurrentPlayer());
    }, []);
    useEffect(() => {
      setRoll(() => meyer.getRoll());
    }, []);
    useEffect(() => {
      setRound(() => meyer.getRound());
    }, []);
    useEffect(() => {
      setTurn(() => meyer.getTurn());
    }, []);
    useEffect(() => {
      setBluffs(meyer.getBluffChoices());
    }, []);
    useEffect(() => {
      setActionChoices(meyer.getActionChoices());
    }, []);
    useEffect(() => {
      setCurrentHealths(meyer.getCurrentHealths());
    }, []);

    return actionChoices.map((action) => (
      <Box display="flex" justifyContent="center" key={action} flexWrap="wrap">
        <Box
          display="flex"
          justifyContent="center"
          bgcolor={colors.primary[700]}
          borderRadius="3px"
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={onClick(action)}
          >
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
  };

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {choices()}
    </Box>
  );
};

interface BluffProps {
  bluffs: number[];
  meyer: Meyer;
  setChosenAction: React.Dispatch<React.SetStateAction<Action>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BluffChoices = ({
  bluffs,
  meyer,
  setChosenAction,
  setShowBluffs,
}: BluffProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const bluffChoices = bluffs.map((bluff) => (
    <Box
      display="flex"
      justifyContent="center"
      key={bluff}
      flexWrap="wrap"
      borderRadius="3px"
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setShowBluffs(false);
          meyer.chooseBluff(bluff);
          meyer.advanceTurn();
          setChosenAction("Error");
        }}
      >
        <Typography fontSize="20px" fontStyle="normal" textTransform="none">
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
  meyer: Meyer;
}

export const Healths = ({ meyer }: HealthsProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="flex-start" minWidth="17%">
      <Box display="flex" flexDirection="column">
        {meyer.getCurrentHealths().map(
          (health, index) =>
            health > 0 && (
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
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};
