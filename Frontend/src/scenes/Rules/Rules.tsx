import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { HOOK, INTRODUCTION } from "./TextSections";
import { POSSIBLEROLLS } from "./PossibleRoles";
import RulesHeading from "./RulesHeading";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column" overflow="auto">
      {/* HEADING */}
      <RulesHeading isDanish={isDanish} />
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
