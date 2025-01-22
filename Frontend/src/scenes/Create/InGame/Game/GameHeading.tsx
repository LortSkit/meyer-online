import { Box, Typography } from "@mui/material";
import {
  translateCurrentPlayerTurn,
  translateRound,
  translateTurn,
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
      <Typography component="span">
        <Typography
          variant="h2"
          display="flex"
          justifyContent="center"
          children={translateRound(isDanish, round)}
        />
        <Typography
          variant="h3"
          display="flex"
          justifyContent="center"
          children={translateTurn(isDanish, turn)}
        />
        <Typography
          fontSize="20px"
          display="flex"
          justifyContent="center"
          children={translateCurrentPlayerTurn(isDanish, currentPlayer)}
        />
      </Typography>
    </Box>
  );
};

export default GameHeading;
