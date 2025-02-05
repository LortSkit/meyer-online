import { Box, Typography } from "@mui/material";
import {
  translateCurrentPlayerNameTurn,
  translateCurrentPlayerValueTurn,
  translateRound,
  translateTurn,
} from "../../utils/lang/components/game/langeGameHeading";

interface Props {
  isDanish: boolean;
  currentPlayer: number | string;
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
          style={{
            wordBreak: "break-all",
            textAlign: "center",
          }}
          children={
            typeof currentPlayer === "number" ? (
              translateCurrentPlayerValueTurn(isDanish, currentPlayer)
            ) : (
              <span
                style={{
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                <strong>{currentPlayer}</strong>
                {translateCurrentPlayerNameTurn(isDanish, currentPlayer)}
              </span>
            )
          }
        />
      </Typography>
    </Box>
  );
};

export default GameHeading;
