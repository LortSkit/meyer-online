import { Box, Typography } from "@mui/material";
import {
  translateCurrentPlayerTurn,
  translateRoundTurn,
} from "../../../../utils/lang/Create/InGame/Game/langeGameHeading";

interface Props {
  isDanish: boolean;
  currentPlayer: number;
  round: number;
  turn: number;
}

const GameHeading = ({ isDanish, currentPlayer, round, turn }: Props) => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Typography
        fontSize="30px"
        display="flex"
        justifyContent="center"
        children={translateRoundTurn(isDanish, round, turn)}
      />
      <Typography
        fontSize="20px"
        display="flex"
        justifyContent="center"
        children={translateCurrentPlayerTurn(isDanish, currentPlayer)}
      />
    </Box>
  );
};

export default GameHeading;
