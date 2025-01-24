import { useRef, useState } from "react";
import { TurnInfo } from "./gameTypes";

///////////////////////////////////////////////////////INIT STATES////////////////////////////////////////////////////////
export function initStates() {
  const [chosenElements, setChosenElements] = useState([] as TurnInfo[]);
  const [chosenElementsBuffer, setChosenElementsBuffer] = useState(
    [] as TurnInfo[]
  );
  const [counter, setCounter] = useState(0);
  const [hasClicked, setHasClicked] = useState([] as boolean[]);
  const [isClicked, setIsClicked] = useState([] as boolean[]);

  const timerId = useRef(null as unknown);

  return {
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
  };
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////TURNINFORMATION UPDATE//////////////////////////////////////////////////
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

function initClicked(turnInformation: TurnInfo[]): boolean[] {
  let result = [] as boolean[];
  turnInformation.forEach(() => {
    result.push(false);
  });
  return result;
}
interface TurnInformationUpdateProps {
  chosenElements: TurnInfo[];
  chosenElementsBuffer: TurnInfo[];
  timerId: React.MutableRefObject<unknown>;
  turnInformation: TurnInfo[];
  setChosenElements: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
  setChosenElementsBuffer: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  setHasClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export function onTurnInformationUpdate({
  chosenElements,
  chosenElementsBuffer,
  timerId,
  turnInformation,
  setChosenElements,
  setChosenElementsBuffer,
  setCounter,
  setHasClicked,
  setIsClicked,
}: TurnInformationUpdateProps): void {
  setCounter(0);
  let init = initClicked(turnInformation);
  setHasClicked(init);
  setIsClicked(init.slice(0, init.length));
  setChosenElements(chosenElements.concat(sortedBuffer(chosenElementsBuffer)));
  setChosenElementsBuffer([]);
  if (timerId.current != null) clearInterval(timerId.current as number);
  timerId.current = setInterval(() => {
    setCounter((i) => i + 1);
  }, 1000);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////COUNTER UPDATE//////////////////////////////////////////////////////
interface CounterUpdateProps {
  counter: number;
  turnInformation: TurnInfo[];
  setTurnInformation: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
}

export function onCounterUpdate({
  counter,
  turnInformation,
  setTurnInformation,
}: CounterUpdateProps): void {
  if (counter - 5 > turnInformation.length - 2) {
    setTurnInformation([]);
  }
  // Anti cheat on keep turn information displayed isn't possible:
  // A program, e.g., a chrome extension, could always write down text written on any given TurnInfo element down.
  // If a record is kept, it will be remembered. It ruins the spirit of the game, sure, but the anti-cheat measures
  // needed to detect and punish said cheaters wouldn't be worth the trouble.
  // For such a small project, there likely aren't gonna be any cheaters anyway (though, be my guest, would love to see how it works ;) )
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////ROUND UPDATE///////////////////////////////////////////////////////
interface RoundUpdateProps {
  setChosenElements: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
}

export function onRoundUpdate({ setChosenElements }: RoundUpdateProps): void {
  setChosenElements([]);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////ONCLICK'ERS////////////////////////////////////////////////////////
interface OnClickCurrentProps {
  chosenElementsBuffer: TurnInfo[];
  setChosenElementsBuffer: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
  setHasClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export function onClickCurrentTurnInfo({
  chosenElementsBuffer,
  setChosenElementsBuffer,
  setHasClicked,
  setIsClicked,
}: OnClickCurrentProps): (value: TurnInfo, index: number) => () => void {
  return (value: TurnInfo, index: number) => () => {
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

interface OnClickChosenProps {
  setChosenElements: React.Dispatch<React.SetStateAction<TurnInfo[]>>;
}

export function onClickChosenTurnInfo({
  setChosenElements,
}: OnClickChosenProps): (value: TurnInfo, index: number) => () => void {
  return (value: TurnInfo, index: number) => () =>
    setChosenElements((ce) =>
      ce.filter((val, idx): idx is number => idx != index)
    );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
