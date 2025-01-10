import { Box, Typography, useTheme } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import { Dice } from "../../../utils/diceUtils";
import { translatePlayerIndex } from "../../../utils/lang/Create/InGame/langPlayerHealths";

interface Props {
  isDanish: boolean;
  currentHealths: number[];
  currentPlayer: number;
  isGameOver: boolean;
}

const PlayerHealths = ({
  isDanish,
  currentHealths,
  currentPlayer,
  isGameOver,
}: Props) => {
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
                  children={translatePlayerIndex(isDanish, index)}
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

export default PlayerHealths;
