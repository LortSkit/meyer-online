import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { Dice } from "../../utils/diceUtils";
import { translatePlayerIndex } from "../../utils/lang/components/game/langPlayersHealthsDisplay";
import { useMediaQuery } from "usehooks-ts";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";

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

  const queryMatches = useMediaQuery("only screen and (min-width: 400px)");

  function fontSizeByQuery() {
    if (queryMatches) {
      return "14px";
    } else {
      return "12px";
    }
  }

  return (
    <Box display="flex" flexDirection="column" flexWrap="wrap">
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
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Dice
                    eyes={health}
                    color={colors.blueAccent[100]}
                    sideLength={25}
                  />
                </Box>
                <Box marginRight="3px" />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  {((displayNames && (playerNames as string[])[index] !== "") ||
                    !displayNames) && (
                    <Typography
                      fontSize={fontSizeByQuery()}
                      component="div"
                      style={{
                        wordBreak: "break-all",
                      }}
                      children={
                        displayNames
                          ? (playerNames as string[])[index]
                          : translatePlayerIndex(isDanish as boolean, index)
                      }
                    />
                  )}
                  {displayNames && (playerNames as string[])[index] === "" && (
                    <img
                      src={loading}
                      width="35px"
                      style={{ paddingLeft: "5px" }}
                    />
                  )}
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
