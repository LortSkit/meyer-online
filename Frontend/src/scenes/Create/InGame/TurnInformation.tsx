import { Box } from "@mui/material";
import { TurnInfo } from "../../../utils/gameTypes";
import { useEffect, useRef, useState } from "react";
import TurnInformationDisplay from "../../../components/game/TurnInformationDisplay/TurnInformationDisplay";

interface Props {
  isDanish: boolean;
  round: number;
  turnInformation: TurnInfo[];

  setTurnInformation: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
}

const TurnInformation = ({
  isDanish,
  round,
  turnInformation,
  setTurnInformation,
}: Props) => {
  const [chosenElements, setChosenElements] = useState([] as TurnInfo[]);
  const [chosenElementsBuffer, setChosenElementsBuffer] = useState(
    [] as TurnInfo[]
  );
  const [counter, setCounter] = useState(0);
  const [hasClicked, setHasClicked] = useState([] as boolean[]);
  const [isClicked, setIsClicked] = useState([] as boolean[]);

  const timerId = useRef(null as unknown);

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
    if (counter - 5 > turnInformation.length) {
      setTurnInformation([]);
    }
    // Anti cheat on keep turn information displayed isn't possible:
    // A program, e.g., a chrome extension, could always write down text written on any given TurnInfo element down.
    // If a record is kept, it will be remembered. It ruins the spirit of the game, sure, but the anti-cheat measures
    // needed to detect and punish said cheaters wouldn't be worth the trouble.
    // For such a small project, there likely aren't gonna be any cheaters anyway (though, be my guest, would love to see how it works ;) )
  }, [counter]);

  useEffect(() => {
    setChosenElements([]);
  }, [round]);

  function onClickCurrentTurnInfo(value: TurnInfo, index: number): () => void {
    return () => {
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
    };
  }

  function onClickChosenTurnInfo(value: TurnInfo, index: number): () => void {
    return () =>
      setChosenElements((ce) =>
        ce.filter((val, idx): idx is number => idx != index)
      );
  }

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <TurnInformationDisplay
        isDanish={isDanish}
        counter={counter}
        hasClicked={hasClicked}
        isClicked={isClicked}
        turnInfoList={chosenElements}
        onClick={onClickChosenTurnInfo}
      />
      <Box paddingTop="4px" />
      <TurnInformationDisplay
        isDanish={isDanish}
        counter={counter}
        hasClicked={hasClicked}
        isClicked={isClicked}
        isTimed
        turnInfoList={turnInformation}
        onClick={onClickCurrentTurnInfo}
      />
    </Box>
  );
};

export default TurnInformation;
