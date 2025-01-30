import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Dice } from "../../utils/diceUtils";
import { translatePlayerIndex } from "../../utils/lang/components/game/langPlayersHealthsDisplay";

interface Props {
  isDanish?: boolean;
  currentHealths: number[];
  currentPlayer?: number;
  playerNames?: string[];
}

const PlayersHealthsDisplay = ({
  isDanish,
  currentHealths,
  currentPlayer,
  playerNames,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isGameOver = currentPlayer ? false : true;

  const displayNames = playerNames ? true : false;

  return (
    <Box display="flex" flexDirection="column">
      {currentHealths.map(
        (health, index) =>
          health > 0 && (
            <Box display="flex" flexDirection="column" key={index}>
              <Box display="flex">
                {currentPlayer == index + 1 && !isGameOver && (
                  <Box display="flex" bgcolor={colors.primary[500]}>
                    <ArrowForwardOutlined />
                  </Box>
                )}
                {!(currentPlayer == index + 1 && !isGameOver) && (
                  <Box paddingLeft="calc(20.5px + 5px)" />
                )}
                <Dice
                  eyes={health}
                  color={colors.blueAccent[100]}
                  sideLength={25}
                />
                <Box marginRight="3px" />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    display="flex"
                    fontSize="14px"
                    children={
                      displayNames
                        ? (playerNames as string[])[index]
                        : translatePlayerIndex(isDanish as boolean, index)
                    }
                  />
                </Box>
              </Box>
              <Box paddingTop="5px" />
            </Box>
          )
      )}
    </Box>
  );
};

export default PlayersHealthsDisplay;
