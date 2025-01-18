import { Box, Button, Typography, useTheme } from "@mui/material";
import { isGreaterThanEqualTo, Meyer } from "../../../../utils/gameLogic";
import { tokens } from "../../../../theme";
import { Action, TurnInfo, TurnInfoType } from "../../../../utils/gameTypes";
import { translateAction } from "../../../../utils/lang/Create/InGame/Game/langActionChoices";

interface ActionProps {
  isDanish: boolean;
  actionChoices: Action[];
  currentHealths: number[];
  currentPlayer: number;
  meyer: Meyer;
  previousAction: Action;
  previousDeclaredRoll: number;
  previousPlayer: number;
  previousRoll: number;
  roll: number;
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

const ActionChoices = ({
  isDanish,
  actionChoices,
  currentHealths,
  currentPlayer,
  meyer,
  previousAction,
  previousDeclaredRoll,
  previousPlayer,
  previousRoll,
  roll,
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
}: ActionProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function endTurn(): void {
    setPreviousPlayer(currentPlayer);
    setCurrentPlayer(meyer.getCurrentPlayer());
    setRoll(-1);
    setTurn(meyer.getTurn());
    setTurnsTotal((t) => t + 1);
  }

  function endRound(): void {
    endTurn();
    setRound(meyer.getRound());
    setCurrentHealths(meyer.getCurrentHealths());
    if (meyer.isGameOver()) {
      setIsGameOver(true);
    }
  }

  function onClick(action: Action): () => void {
    return () => {
      let numbersList: number[] = [currentPlayer];
      let toBeTurnInfo: TurnInfo[] = [[action, numbersList]];

      if (action != "Error") {
        meyer.takeAction(action);
        setPreviousAction(action);

        if (action != "Bluff") {
          meyer.advanceTurn();
        }
      }

      switch (action) {
        case "Error":
          break;

        case "Check":
          toBeTurnInfo = [["Check", [currentPlayer, previousPlayer]]];
          let turnInfoType: string = "Check";
          previousAction == "SameRollOrHigher"
            ? (turnInfoType += "T")
            : (turnInfoType += "F");

          let currentPlayerLost =
            previousDeclaredRoll == previousRoll ||
            (previousAction == "SameRollOrHigher" &&
              isGreaterThanEqualTo(previousRoll, previousDeclaredRoll));

          currentPlayerLost ? (turnInfoType += "T") : (turnInfoType += "F");

          toBeTurnInfo.push([
            turnInfoType as TurnInfoType,
            [previousPlayer, previousDeclaredRoll, previousRoll],
          ]);

          if (previousRoll != 32) {
            let losingPlayer = currentPlayerLost
              ? currentPlayer
              : previousPlayer;
            let healthToLose =
              previousRoll == 21 || previousDeclaredRoll == 21 ? 2 : 1;

            toBeTurnInfo.push([
              "CheckLoseHealth",
              [losingPlayer, healthToLose],
            ]);
          }

          setTurnInformation(toBeTurnInfo);
          endRound();
          break;

        case "HealthRoll":
          numbersList.push(currentHealths[currentPlayer - 1]);
          toBeTurnInfo = [[action, numbersList]];
          setTurnInformation(toBeTurnInfo);
          endRound();
          break;

        case "Roll":
          setRoll(meyer.getRoll());
          setTurnInformation(toBeTurnInfo);
          break;

        case "Cheers":
          setTurnInformation(toBeTurnInfo);
          endRound();
          break;

        case "SameRollOrHigher":
          setPreviousRoll(meyer.getPreviousRoll());
          setTurnInformation(toBeTurnInfo);
          endTurn();
          break;

        case "Truth":
          setPreviousDeclaredRoll(roll);
          setPreviousRoll(roll);
          numbersList.push(roll);
          toBeTurnInfo = [[action, numbersList]];
          setTurnInformation(toBeTurnInfo);
          endTurn();
          break;

        case "Bluff":
          setBluffs(meyer.getBluffChoices());
          setShowBluffs(true);
          setPreviousRoll(roll);
          break;
      }

      setActionChoices(meyer.getActionChoices());
    };
  }

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
            children={translateAction(isDanish, action)}
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

export default ActionChoices;
