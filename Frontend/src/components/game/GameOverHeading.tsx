import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  translateCurrentPlayerNameWon,
  translateCurrentPlayerValueWon,
  translateRoundTurnsTotal,
} from "../../utils/lang/components/game/langGameOverHeading";

interface Props {
  isDanish: boolean;
  currentPlayer: number | string;
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
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        children={
          typeof currentPlayer === "number"
            ? translateCurrentPlayerValueWon(isDanish, currentPlayer)
            : translateCurrentPlayerNameWon(isDanish, currentPlayer)
        }
      />
      <Typography
        fontSize="20px"
        display="flex"
        justifyContent="center"
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        children={translateRoundTurnsTotal(isDanish, round - 1, turnsTotal - 1)}
      />
    </Box>
  );
};

export default GameOverHeading;
