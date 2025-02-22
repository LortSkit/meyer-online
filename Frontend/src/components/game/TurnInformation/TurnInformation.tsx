import Box from "@mui/material/Box";
import { TurnInfo } from "../../../utils/gameTypes";
import { useEffect } from "react";
import TurnInformationDisplay from "./TurnInformationDisplay";
import {
  onTurnInformationUpdate,
  onCounterUpdate,
  onRoundUpdate,
  initStates,
  onClickCurrentTurnInfo,
  onClickChosenTurnInfo,
} from "../../../utils/turnInformationUtils";

interface Props {
  isDanish: boolean;
  playerNames?: string[];
  round: number;
  showTimer: boolean;
  turnInformation: TurnInfo[];

  setTurnInformation:
    | React.Dispatch<React.SetStateAction<TurnInfo[]>>
    | ((update: TurnInfo[]) => void);
}

const TurnInformation = ({
  isDanish,
  playerNames,
  round,
  showTimer,
  turnInformation,
  setTurnInformation,
}: Props) => {
  const {
    chosenElements,
    setChosenElements,
    chosenElementsBuffer,
    setChosenElementsBuffer,
    counter,
    setCounter,
    hasClicked,
    setHasClicked,
    isClicked,
    setIsClicked,
    timerId,
  } = initStates();

  useEffect(() => {
    onTurnInformationUpdate({
      chosenElements,
      chosenElementsBuffer,
      timerId,
      turnInformation,
      setChosenElements,
      setChosenElementsBuffer,
      setCounter,
      setHasClicked,
      setIsClicked,
    });
  }, [turnInformation]);

  useEffect(() => {
    onCounterUpdate({ counter, turnInformation, setTurnInformation });
  }, [counter]);

  useEffect(() => {
    onRoundUpdate({ setChosenElements });
  }, [round]);

  return (
    <Box display="flex" justifyContent="flex-start" flexDirection="column">
      <TurnInformationDisplay
        isDanish={isDanish}
        hasClicked={hasClicked}
        isClicked={isClicked}
        playerNames={playerNames ? playerNames : undefined}
        showTimer={false}
        turnInfoList={chosenElements}
        onClick={onClickChosenTurnInfo({ setChosenElements })}
      />
      <Box paddingTop="4px" />
      <TurnInformationDisplay
        isDanish={isDanish}
        counter={counter}
        hasClicked={hasClicked}
        isClicked={isClicked}
        isTimed
        playerNames={playerNames ? playerNames : undefined}
        showTimer={showTimer}
        turnInfoList={turnInformation}
        onClick={onClickCurrentTurnInfo({
          chosenElementsBuffer,
          setChosenElementsBuffer,
          setHasClicked,
          setIsClicked,
        })}
      />
    </Box>
  );
};

export default TurnInformation;
