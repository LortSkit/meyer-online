import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { TurnInfo } from "../../../utils/gameTypes";
import { useState } from "react";
import CircularWithValueLabel from "./CircularProgressWithLabel";
import { translateTurnInfo } from "../../../utils/lang/game/TurnInformationDisplay/langTurnInformationDisplay";

type OnClickMiddleMan = (value: TurnInfo, index: number) => () => void;

function isOnClickMiddleMan(val: any): val is OnClickMiddleMan {
  return (val as OnClickMiddleMan) === val;
}

interface Props {
  isDanish: boolean;
  counter: number;
  hasClicked: boolean[];
  isClicked: boolean[];
  isTimed?: boolean;
  turnInfoList: TurnInfo[];
  onClick?:
    | React.MouseEventHandler<HTMLButtonElement>
    | OnClickMiddleMan
    | undefined;
}

const TurnInformationDisplay = ({
  isDanish,
  counter,
  hasClicked,
  isClicked,
  isTimed,
  turnInfoList,
  onClick,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const timeLength = 5;
  const ringFontSize = 20;

  function isVisible(index: number): boolean {
    return index + timeLength > counter;
  }

  return turnInfoList.map((value: TurnInfo, index: number) => (
    <Box
      key={index}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Box display="flex" justifyContent="center" width="100%">
        {(!isTimed ||
          (isVisible(index) && !hasClicked[index]) ||
          isClicked[index]) && (
          <Box display="flex" justifyContent="center">
            <Button
              variant="text"
              onClick={
                isOnClickMiddleMan(onClick) ? onClick(value, index) : onClick
              }
              sx={{
                color: colors.blackAccent[100],
                backgroundColor: !isTimed
                  ? colors.greenAccent[800]
                  : !isClicked[index]
                  ? colors.primary[700]
                  : colors.greenAccent[600],
              }}
            >
              <Box display="flex" justifyContent="center">
                <Typography
                  fontSize={isTimed ? "20px" : "16px"}
                  fontStyle="normal"
                  textTransform="none"
                  children={translateTurnInfo(isDanish, value)}
                />
              </Box>
            </Button>
            {isTimed && isVisible(index) && !hasClicked[index] && (
              <>
                <Box paddingLeft="10px" />
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <CircularWithValueLabel
                    value={index + timeLength - counter}
                    maxvalue={index + timeLength}
                    overridecolor={colors.primary[100]}
                    ringSize={ringFontSize}
                  />
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
      <Box paddingTop="4px" />
    </Box>
  ));
};

export default TurnInformationDisplay;
