import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <Box display="flex" justifyContent="center">
        <Typography
          variant="h1"
          color={colors.blueAccent[100]}
          fontWeight="bold"
          children={isDanish ? "Find spil" : "Find games"}
        />
      </Box>
    </Box>
  );
};

export default Find;
