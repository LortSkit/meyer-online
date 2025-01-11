import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { TurnInfo } from "../../../../utils/gameTypes";
import { translateTurnInfo } from "../../../../utils/lang/Create/InGame/langTurnInformation";
import { tokens } from "../../../../theme";
import { useEffect, useRef, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import CircularWithValueLabel from "./CircularProgressWithLabel";

interface Props {
  isDanish: boolean;
  turnInformation: TurnInfo[];
}

const TurnInformation = ({ isDanish, turnInformation }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [counter, setCounter] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const timerId = useRef(null as unknown);

  const timeLength = 5;

  useEffect(() => {
    setCounter(0);
    setHasClicked(false);
    if (timerId.current != null) clearInterval(timerId.current as number);
    timerId.current = setInterval(() => {
      setCounter((i) => i + 1);
    }, 1000);
  }, [turnInformation]);

  function isClickable(value: TurnInfo) {
    return value[0] == "Truth" || value[0] == "Bluff";
  }

  function isVisible(index: number): boolean {
    return index + timeLength > counter || (index === 0 && hasClicked);
  }

  return turnInformation.map((value: TurnInfo, index: number) => (
    <Box
      key={index}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box display="flex" justifyContent="center">
        {(isVisible(index) || index > 0) && (
          <Button
            variant="text"
            disabled={!isClickable(value)}
            onClick={() => setHasClicked(!hasClicked)}
            sx={{
              color: colors.blackAccent[100],
              transition: isClickable(value) ? undefined : "none",
              backgroundColor:
                (isClickable(value) && !hasClicked && index === 0) ||
                !isClickable(value)
                  ? colors.primary[700]
                  : colors.greenAccent[600],
              "&:disabled": {
                color: hasClicked ? colors.blackAccent[100] : undefined,
              },
            }}
          >
            <Typography
              fontSize="15px"
              fontStyle="normal"
              textTransform="none"
              children={translateTurnInfo(isDanish, value)}
            />
          </Button>
        )}
        <Box paddingLeft="4px" />
        {isVisible(index) &&
          !hasClicked &&
          index === 0 &&
          isClickable(value) && (
            <Box display="flex">
              <CircularWithValueLabel
                value={index + timeLength - counter}
                maxvalue={index + timeLength}
                overridecolor={colors.primary[100]}
              />
            </Box>
          )}
      </Box>
      <Box paddingTop="4px" />
    </Box>
  ));
};

export default TurnInformation;
