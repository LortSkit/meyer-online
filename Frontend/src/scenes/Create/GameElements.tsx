import { Box, Button, Typography, useTheme } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import {
  Action,
  isAction,
  isGreaterThanEqualTo,
  Meyer,
} from "../../utils/gameLogic";
import { tokens } from "../../theme";
import { Dice, RollWithName } from "../../utils/diceUtils";

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

export const ActionChoices = ({
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
  const translateActions: { [action: string]: string } = {
    ["Error"]: isDanish ? "FEJL!" : "ERROR!",
    ["Check"]: isDanish ? "Tjek" : "Check",
    ["HealthRoll"]: isDanish ? "Rul nyt liv" : "Roll new health",
    ["Roll"]: isDanish ? "Rul" : "Roll",
    ["Cheers"]: isDanish ? "SKÅL!" : "CHEERS!",
    ["SameRollOrHigher"]: isDanish
      ? "Dét eller derover"
      : "Same roll or higher",
    ["Truth"]: isDanish ? "Sandhed" : "Truth",
    ["Bluff"]: isDanish ? "Bluf" : "Bluff",
  };

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
    return function onClickInner(): void {
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

            toBeTurnInfo.push(["Check?", [losingPlayer, healthToLose]]);
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
  currentPlayer: number;
  meyer: Meyer;
  setActionChoices: React.Dispatch<React.SetStateAction<Action[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setPreviousAction: React.Dispatch<React.SetStateAction<Action>>;
  setPreviousDeclaredRoll: React.Dispatch<React.SetStateAction<number>>;
  setPreviousPlayer: React.Dispatch<React.SetStateAction<number>>;
  setRoll: React.Dispatch<React.SetStateAction<number>>;
  setShowBluffs: React.Dispatch<React.SetStateAction<boolean>>;
  setTurn: React.Dispatch<React.SetStateAction<number>>;
  setTurnInformation: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
  setTurnsTotal: React.Dispatch<React.SetStateAction<number>>;
}

export const BluffChoices = ({
  bluffs,
  currentPlayer,
  meyer,
  setActionChoices,
  setCurrentPlayer,
  setPreviousAction,
  setPreviousDeclaredRoll,
  setPreviousPlayer,
  setRoll,
  setShowBluffs,
  setTurn,
  setTurnInformation,
  setTurnsTotal,
}: BluffProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function endTurn(): void {
    setPreviousPlayer(currentPlayer);
    setCurrentPlayer(meyer.getCurrentPlayer());
    setRoll(-1);
    setTurn(meyer.getTurn());
    setTurnsTotal((t) => t + 1);
  }

  function onClick(bluff: number): () => void {
    return function onClickInner(): void {
      meyer.chooseBluff(bluff);
      meyer.advanceTurn();
      setActionChoices(meyer.getActionChoices());
      setPreviousAction("Bluff");
      setPreviousDeclaredRoll(bluff);
      setShowBluffs(false);
      setTurnInformation([["Bluff", [currentPlayer, bluff]]]);
      endTurn();
    };
  }

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
    <Box display="flex" justifyContent="flex-start" minWidth="21%">
      <Box display="flex" flexDirection="column">
        {currentHealths.map(
          (health, index) =>
            health > 0 && (
              <Box display="flex" key={index}>
                {currentPlayer == index + 1 && !isGameOver && (
                  <ArrowForwardOutlined />
                )}
                {!(currentPlayer == index + 1 && !isGameOver) && (
                  <Box paddingLeft="calc(20.5px + 5px)" />
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
                <Box paddingLeft="5px" />
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};

type TurnInfoType =
  | Action
  | "CheckTT"
  | "CheckFT"
  | "CheckTF"
  | "CheckFF"
  | "Check?";

export type TurnInfo = [TurnInfoType, number[]];

export function TurnInfoToMessage(isDanish: boolean, turnInfo: TurnInfo) {
  let currentPlayer = -1;
  let bluff = -1;
  let healthRoll = -1;
  let healthToLose = -1;
  let previousDeclaredRoll = -1;
  let previousPlayer = -1;
  let previousRoll = -1;
  let roll = -1;

  if (isAction(turnInfo[0])) {
    currentPlayer = turnInfo[1][0];
  } else {
    previousPlayer = turnInfo[1][0];
    previousDeclaredRoll = turnInfo[1][1];
    previousRoll = turnInfo[1][2];
  }

  switch (turnInfo[0]) {
    case "Error":
      throw new Error("This could SHOULD be unreachable");

    case "Check":
      previousPlayer = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} valgte at tjekke Spiller ${previousPlayer}'s slag...`
        : `Player ${currentPlayer} chose to check Player ${previousPlayer}'s roll...`;

    case "CheckTT":
      return isDanish
        ? `Spiller ${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${previousDeclaredRoll}, og deres rul var ${previousRoll}${
            previousRoll == 32 ? "!" : ""
          }`
        : `Player ${previousPlayer} had declared "Same roll or higher" and had to roll at least ${previousDeclaredRoll} and their roll was ${previousRoll}${
            previousRoll == 32 ? "!" : ""
          }`;

    case "CheckFT":
      return isDanish
        ? `Spiller ${previousPlayer} sagde, de slog ${previousDeclaredRoll}, og deres slag var virkelig ${previousRoll}`
        : `Player ${previousPlayer} had declared ${previousDeclaredRoll} and their roll was indeed ${previousRoll}`;

    case "CheckTF":
      return isDanish
        ? `Spiller ${previousPlayer} sagde "Dét eller derover" og skulle derfor rulle mindst ${previousDeclaredRoll}, men deres rul var kun ${previousRoll}...`
        : `Player ${previousPlayer} had declared "Same roll or higher" and had to roll at least ${previousDeclaredRoll} but their roll was only ${previousRoll}...`;

    case "CheckFF":
      return isDanish
        ? `Spiller ${previousPlayer} sagde, de slog ${previousDeclaredRoll}, og deres slag var virkelig ${previousRoll}`
        : `Player ${previousPlayer} had declared ${previousDeclaredRoll} and their roll was actually ${previousRoll}`;

    case "Check?":
      let losingPlayer = turnInfo[1][0];
      healthToLose = turnInfo[1][1];
      return isDanish
        ? `Spiller ${losingPlayer} mistede ${healthToLose} liv`
        : `Player ${losingPlayer} lost ${healthToLose} ${
            healthToLose > 1 ? "lives" : "life"
          }`;

    case "HealthRoll":
      healthRoll = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} rullede deres liv af værdi 3 om til ${healthRoll}`
        : `Player ${currentPlayer} rolled their health of 3 into ${healthRoll}`;

    case "Roll":
      return isDanish
        ? `Spiller ${currentPlayer} valgte at rulle...`
        : `Player ${currentPlayer} chose to roll...`;

    case "Cheers":
      return isDanish
        ? `Spiller ${currentPlayer} sagde "Skål!"`
        : `Player ${currentPlayer} said "Cheers!"`;

    case "SameRollOrHigher":
      return isDanish
        ? `Spiller ${currentPlayer} sagde "Dét eller derover"`
        : `Player ${currentPlayer} declared "Same roll or higher"`;

    case "Truth":
      roll = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} sagde, de slog ${roll}`
        : `Player ${currentPlayer} declared ${roll}`;

    case "Bluff":
      bluff = turnInfo[1][1];
      return isDanish
        ? `Spiller ${currentPlayer} sagde, de slog ${bluff}`
        : `Player ${currentPlayer} declared ${bluff}`;
  }
}

interface TurnInformationProps {
  isDanish: boolean;
  turnInformation: TurnInfo[];
}

export const TurnInformation = ({
  isDanish,
  turnInformation,
}: TurnInformationProps) => {
  return turnInformation.map((value: TurnInfo, index: number) => (
    <Box
      key={index}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box display="flex" justifyContent="center">
        {TurnInfoToMessage(isDanish, value)}
      </Box>
    </Box>
  ));
};
