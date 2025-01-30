import { Box, useTheme } from "@mui/material";
import { Meyer } from "../../../../../utils/gameLogic";
import { Action, TurnInfo } from "../../../../../utils/gameTypes";
import { tokens } from "../../../../../theme";
import BluffButton from "../../../../../components/game/BluffButton";

interface Props {
  isDanish: boolean;
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

const BluffChoices = ({
  isDanish,
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
}: Props) => {
  function endTurn(): void {
    setPreviousPlayer(currentPlayer);
    setCurrentPlayer(meyer.getCurrentPlayer());
    setRoll(-1);
    setTurn(meyer.getTurn());
    setTurnsTotal((t) => t + 1);
  }

  function onClick(bluff: number): () => void {
    return () => {
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
      <BluffButton isDanish={isDanish} bluff={bluff} onClick={onClick(bluff)} />
      <Box marginLeft="3px" />
    </Box>
  ));
  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {bluffChoices}
    </Box>
  );
};

export default BluffChoices;
