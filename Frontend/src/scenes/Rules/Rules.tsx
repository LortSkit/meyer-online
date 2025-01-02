import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
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
      <Box p={2}>
        {/* HOOK */}
        <HOOK isDanish={isDanish} />
        {/* INTRODUCTION */}
        <INTRODUCTION isDanish={isDanish} />
        {/* POSSIBLE ROLLS */}
        <POSSIBLEROLLS isDanish={isDanish} />
      </Box>
    </Box>
  );
};

export default Rules;
