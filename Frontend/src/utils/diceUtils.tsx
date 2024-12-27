import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { Dice } from "../components/icons/DiceIcons";
import { Box, SxProps, Theme } from "@mui/material";

//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function _getRandomInt(min: Int32, max: Int32) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function _getRoll(): [Int32, Int32] {
  return [_getRandomInt(1, 7), _getRandomInt(1, 7)];
}

function _determineRoll(roll: [Int32, Int32]): Int32 {
  if (roll[0] > roll[1]) {
    return roll[0] * 10 + roll[1];
  } else {
    return roll[1] * 10 + roll[0];
  }
}

export function getRoll() {
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
    <Box sx={sx}>
      <Dice
        eyes={Math.floor(roll / 10)}
        color={color}
        sideLength={sideLength}
      />
      <Dice eyes={roll % 10} color={color} sideLength={sideLength} />
    </Box>
  );
};

export const RollWithName = ({ roll, color, sideLength, sx }: RollProps) => (
  <Box display="flex" flexDirection="column">
    <Box display="flex" justifyContent="center">
      <Roll roll={roll} color={color} sideLength={sideLength} sx={sx} />
    </Box>
    <Box display="flex" justifyContent="center">
      {roll}
    </Box>
  </Box>
);
