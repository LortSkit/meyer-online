import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import {
  Dice0,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "../components/icons/DiceIcons";
import { translateRollName } from "./lang/langDiceUtils";

//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

interface DiceProps {
  eyes: Int32;
  color: string;
  sideLength: Int32;
}

export const Dice = ({ eyes, color, sideLength }: DiceProps) => {
  switch (eyes) {
    case 1:
      return Dice1({ color, sideLength });
    case 2:
      return Dice2({ color, sideLength });
    case 3:
      return Dice3({ color, sideLength });
    case 4:
      return Dice4({ color, sideLength });
    case 5:
      return Dice5({ color, sideLength });
    case 6:
      return Dice6({ color, sideLength });
    default:
      return Dice0({ color, sideLength });
  }
};

function _getRandomInt(min: Int32, max: Int32) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export function getDiceRoll(): Int32 {
  return _getRandomInt(1, 7);
}

function _getRoll(): [Int32, Int32] {
  return [getDiceRoll(), getDiceRoll()];
}

function _determineRoll(roll: [Int32, Int32]): Int32 {
  if (roll[0] > roll[1]) {
    return roll[0] * 10 + roll[1];
  } else {
    return roll[1] * 10 + roll[0];
  }
}

export function getMeyerRoll() {
  return _determineRoll(_getRoll());
}

interface RollProps {
  roll: Int32;
  color: string;
  sideLength: Int32;
  sx?: SxProps<Theme> | undefined;
}

export const Roll = ({ roll, color, sideLength, sx }: RollProps) => {
  return (
    <Box sx={sx} display="flex" flexDirection="row">
      <Dice
        eyes={Math.floor(roll / 10)}
        color={color}
        sideLength={sideLength}
      />
      <Box marginLeft="3px" />
      <Dice eyes={roll % 10} color={color} sideLength={sideLength} />
    </Box>
  );
};

interface RollWithNameProps {
  isDanish: boolean;
  roll: Int32;
  color: string;
  sideLength: Int32;
  sx?: SxProps<Theme> | undefined;
}

export const RollWithName = ({
  isDanish,
  roll,
  color,
  sideLength,
  sx,
}: RollWithNameProps) => (
  <Box display="flex" flexDirection="column" sx={sx}>
    <Box display="flex" justifyContent="center">
      <Roll roll={roll} color={color} sideLength={sideLength} />
    </Box>
    <Box display="flex" justifyContent="center">
      {translateRollName(isDanish, roll)}
    </Box>
  </Box>
);
