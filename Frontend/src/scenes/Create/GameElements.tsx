import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Action, Meyer } from "../../utils/gameLogic";
import { tokens } from "../../theme";
import { RollWithName } from "../../utils/diceUtils";
import { useEffect, useState } from "react";

interface ActionProps {
  isDanish: boolean;
  meyer: Meyer;
  setChosenAction: React.Dispatch<React.SetStateAction<Action>>;
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
  setBluffs,
  roll,
  setTurn,
  setRoll,
  setRound,
  setShowBluffs,
}: ActionProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [actionChoices, setActionChoices] = useState(["Roll"]); //Temporary value
  const translateActions: { [action: string]: string } = {
    ["Check"]: isDanish ? "Tjek" : "Check",
    ["Roll"]: isDanish ? "Rul" : "Roll",
    ["Truth"]: isDanish ? "Sandhed" : "Truth",
    ["Bluff"]: isDanish ? "Bluf" : "Bluff",
    ["SameRollOrHigher"]: isDanish
      ? "Det eller derover"
      : "Same roll or higher",
    ["Cheers"]: isDanish ? "SKÅL!" : "CHEERS!",
  };

  const onClick = (action: string) => () => {
    let trueRoll = roll;
    if (action == "Roll") {
      trueRoll = meyer.getRoll();
      setRoll(trueRoll);
    }
    //Handles in-game actions
    if (trueRoll == 32 && action != "Cheers") {
      setActionChoices(["Cheers"]);
    } else {
      setActionChoices(meyer.getActionChoices());
    }
    action != "Cheers" ? setChosenAction(action as Action) : undefined;
    action != "Cheers" ? meyer.takeAction(action as Action) : undefined;
    if (action != "Bluff" && (trueRoll != 32 || action == "Cheers")) {
      meyer.advanceTurn();

      // I don't understand why, but if I remove the below,
      // then I no longer force an update to display...
      if (action == "Roll") {
        setRoll(meyer.getRoll());
      }
    } else if (action == "Bluff") {
      setBluffs(meyer.getBluffChoices());
      setShowBluffs(true);
    }
    if (action != "Cheers") {
      setActionChoices(meyer.getActionChoices());
    }
    if (
      action == "Truth" ||
      action == "SameRollOrHigher" ||
      action == "Cheers" ||
      action == "Check"
    ) {
      setTurn((t) => t + 1);
      setChosenAction("Error");
      setRoll(-1);
    }
    if (action == "Check") {
      setTurn(1);
      setRound((r) => r + 1);
    }
  };

  const choices = () => {
    useEffect(() => {
      setRoll(() => meyer.getRoll());
    }, []);
    useEffect(() => {
      setRound(() => meyer.getRound());
    }, []);
    useEffect(() => {
      const lastAction = meyer.getLastAction();
      setChosenAction(() => lastAction);
      if (lastAction == "Bluff") {
        setBluffs(meyer.getBluffChoices());
      }
    }, []);
    useEffect(() => {
      roll != 32
        ? setActionChoices(meyer.getActionChoices())
        : setActionChoices(["Cheers"]);
    }, [roll]);

    return actionChoices.map((action) => (
      <Box
        display="flex"
        flexBasis={`${100 / actionChoices.length}%`}
        justifyContent="center"
        key={action}
      >
        <Box
          display="flex"
          justifyContent="center"
          bgcolor={colors.primary[700]}
        >
          <IconButton onClick={onClick(action)}>
            <Typography
              fontSize="20px"
              children={translateActions[action as string]}
            />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" />
      </Box>
    ));
  };

  return (
    <Box display="flex" justifyContent="center">
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
      flexBasis={`${100 / bluffs.length}%`}
      justifyContent="center"
      key={bluff}
    >
      <Box display="flex" justifyContent="center" bgcolor={colors.primary[700]}>
        <IconButton
          onClick={() => {
            setShowBluffs(false);
            meyer.chooseBluff(bluff);
            meyer.advanceTurn();
            setChosenAction("Error");
          }}
        >
          <RollWithName
            roll={bluff}
            color={colors.blueAccent[100]}
            sideLength={12}
          />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center" />
    </Box>
  ));
  return (
    <Box display="flex" justifyContent="center">
      {bluffChoices}
    </Box>
  );
};
