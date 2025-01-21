import { Box, Typography } from "@mui/material";
import {
  translateCurrentPlayerWon,
  translateRoundTurnsTotal,
} from "../../../../utils/lang/Create/InGame/GameOver/langGameOverHeading";

interface Props {
  isDanish: boolean;
  currentPlayer: number;
  round: number;
  turnsTotal: number;
}

const GameOverHeading = ({
  isDanish,
  currentPlayer,
  round,
  turnsTotal,
}: Props) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Typography
        fontSize="30px"
        display="flex"
        justifyContent="center"
        children={translateCurrentPlayerWon(isDanish, currentPlayer)}
      />
      <Typography
        fontSize="20px"
        display="flex"
        justifyContent="center"
        children={translateRoundTurnsTotal(isDanish, round, turnsTotal)}
      />
    </Box>
  );
};

export default GameOverHeading;
