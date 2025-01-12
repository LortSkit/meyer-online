import { Box, Button, Typography, useTheme } from "@mui/material";
import { TurnInfo } from "../../../../utils/gameTypes";
import { translateTurnInfo } from "../../../../utils/lang/Create/InGame/langTurnInformation";
import { tokens } from "../../../../theme";
import { useEffect, useRef, useState } from "react";
import CircularWithValueLabel from "./CircularProgressWithLabel";

interface Props {
  isDanish: boolean;
  round: number;
  turnInformation: TurnInfo[];
}

const TurnInformation = ({ isDanish, round, turnInformation }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chosenElements, setChosenElements] = useState([] as TurnInfo[]);
  const [chosenElementsBuffer, setChosenElementsBuffer] = useState(
    [] as TurnInfo[]
  );
  const [counter, setCounter] = useState(0);
  const [hasClicked, setHasClicked] = useState([] as boolean[]);
  const [isClicked, setIsClicked] = useState([] as boolean[]);

  const timerId = useRef(null as unknown);

  const timeLength = 5;

  function initClicked(turnInformation: TurnInfo[]): boolean[] {
    let result = [] as boolean[];
    turnInformation.forEach(() => {
      result.push(false);
    });
    return result;
  }

  function sortedBuffer(buffer: TurnInfo[]): TurnInfo[] {
    if (buffer.length <= 1) {
      return buffer;
    }

    let result: TurnInfo[] = [];

    function insertSorted(ti: TurnInfo): void {
      if (ti[0] === "Check") {
        result = [ti].concat(result);
      } else if (ti[0] === "CheckLoseHealth") {
        result = result.concat([ti]);
      } else {
        result.length === 2
          ? (result = [result[0], ti, result[1]])
          : result.length > 0
          ? result[0][0] === "Check"
            ? (result = result.concat([ti]))
            : (result = [ti].concat(result))
          : (result = [ti]);
      }
    }

    buffer.forEach((value) => insertSorted(value));

    return result;
  }

  useEffect(() => {
    setCounter(0);
    let init = initClicked(turnInformation);
    setHasClicked(init);
    setIsClicked(init.slice(0, init.length));
    setChosenElements(
      chosenElements.concat(sortedBuffer(chosenElementsBuffer))
    );
    setChosenElementsBuffer([]);
    if (timerId.current != null) clearInterval(timerId.current as number);
    timerId.current = setInterval(() => {
      setCounter((i) => i + 1);
    }, 1000);
  }, [turnInformation]);

  useEffect(() => {
    setChosenElements([]);
  }, [round]);

  function isVisible(index: number): boolean {
    return index + timeLength > counter;
  }

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {chosenElements.map((value: TurnInfo, index: number) => (
        <Box
          key={index}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display="flex" justifyContent="center">
            <Button
              variant="text"
              onClick={() =>
                setChosenElements((ce) =>
                  ce.filter((val, idx): idx is number => idx != index)
                )
              }
              sx={{
                color: colors.blackAccent[100],
                backgroundColor: colors.greenAccent[800],
                // "&:disabled": {
                //   color: isClicked[index] ? colors.blackAccent[100] : undefined,
                // },
              }}
            >
              <Typography
                fontSize="15px"
                fontStyle="normal"
                textTransform="none"
                children={translateTurnInfo(isDanish, value)}
              />
            </Button>
          </Box>
          <Box paddingTop="4px" />
        </Box>
      ))}

      {turnInformation.map((value: TurnInfo, index: number) => (
        <Box
          key={index}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display="flex" justifyContent="center">
            {((isVisible(index) && !hasClicked[index]) || isClicked[index]) && (
              <Button
                variant="text"
                onClick={() => {
                  setIsClicked((ic) => {
                    ic[index] = !ic[index];
                    return ic;
                  });
                  setHasClicked((hc) => {
                    hc[index] = true;
                    return hc;
                  });

                  setChosenElementsBuffer(() => {
                    //works because at most three elements in turnInformation
                    let newbuffer = chosenElementsBuffer.filter(
                      (val): val is TurnInfo => val != value
                    );
                    let result =
                      newbuffer.length === chosenElementsBuffer.length
                        ? chosenElementsBuffer.concat([value])
                        : newbuffer;
                    return result;
                  });
                }}
                sx={{
                  color: colors.blackAccent[100],
                  //transition: isClickable(value) ? undefined : "none",
                  backgroundColor: !isClicked[index]
                    ? colors.primary[700]
                    : colors.greenAccent[600],
                  // "&:disabled": {
                  //   color: isClicked[index]
                  //     ? colors.blackAccent[100]
                  //     : undefined,
                  // },
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
            {isVisible(index) && !hasClicked[index] && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                {/* <Box display="flex" flexDirection="column"></Box> */}
                <Box
                  position="absolute"
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <CircularWithValueLabel
                    value={index + timeLength - counter}
                    maxvalue={index + timeLength}
                    overridecolor={colors.primary[100]}
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Box paddingTop="4px" />
        </Box>
      ))}
    </Box>
  );
};

export default TurnInformation;
