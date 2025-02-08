import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { Dice } from "../../../../utils/diceUtils";
import { tokens } from "../../../../theme";

const MeyerLogo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" justifyContent="space-between" flexBasis="100%">
      <Box display="flex" justifyContent="center" flexBasis="100%">
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Dice eyes={2} color={colors.blueAccent[100]} sideLength={24} />
        </Box>
      </Box>
      <Typography
        variant="h2"
        color={colors.blueAccent[100]}
        fontWeight="bold"
        children={"Meyer"}
      />
      <Box display="flex" justifyContent="center" flexBasis="100%">
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Dice eyes={1} color={colors.blueAccent[100]} sideLength={24} />
        </Box>
      </Box>
    </Box>
  );
};

export default MeyerLogo;
