import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { tokens } from "../../../theme";
import { TurnInfo } from "../../../utils/gameTypes";
import CircularWithValueLabel from "./CircularProgressWithLabel";
import { translateTurnInfo } from "../../../utils/lang/components/game/TurnInformation/langTurnInformationDisplay";

type OnClickMiddleMan = (value: TurnInfo, index: number) => () => void;

function isOnClickMiddleMan(val: any): val is OnClickMiddleMan {
  return (val as OnClickMiddleMan) === val;
}

interface Props {
  isDanish: boolean;
  counter?: number;
  hasClicked: boolean[];
  isClicked: boolean[];
  isTimed?: boolean;
  playerNames?: string[];
  showTimer: boolean;
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
  playerNames,
  showTimer,
  turnInfoList,
  onClick,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const timeLength = 10;
  const ringFontSize = 20;

  if (isTimed && counter === undefined) {
    throw new Error("Cannot have timed TurnInformation without counter!");
  }

  function isVisible(index: number): boolean {
    if (counter) {
      return index + timeLength > counter;
    }

    return true;
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
                  children={translateTurnInfo(
                    isDanish,
                    value,
                    playerNames ? playerNames : undefined
                  )}
                />
              </Box>
            </Button>
            {isTimed && isVisible(index) && showTimer && !hasClicked[index] && (
              <>
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <CircularWithValueLabel
                    value={
                      counter
                        ? index + timeLength - counter
                        : index + timeLength
                    }
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
