import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Outlet } from "react-router-dom";
import { getMeyerRoll, RollWithName } from "../../utils/diceUtils";
import { useState } from "react";
import { HEADING, HOOK, INTRODUCTION } from "./TextSections";
import { POSSIBLEROLLS } from "./PossibleRoles";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [roll, setRoll] = useState(0);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column" overflow="auto">
      {/* HEADING */}
      <HEADING isDanish={isDanish} />
      {/* HOOK */}
      <HOOK isDanish={isDanish} />
      {/* INTRODUCTION */}
      <INTRODUCTION isDanish={isDanish} />
      {/* POSSIBLE ROLLS */}
      <POSSIBLEROLLS isDanish={isDanish} />

      {/* RANDOM ROLL */}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center" flexBasis="100%">
          {roll == 0 && "Click below for random roll!"}
          {roll != 0 && (
            <RollWithName
              roll={roll}
              color={colors.blueAccent[100]}
              sideLength={12}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="center" flexBasis="100%">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setRoll(getMeyerRoll());
            }}
          >
            Roll!
          </Button>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Rules;
