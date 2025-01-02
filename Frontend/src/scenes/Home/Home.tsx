import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
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
          children={"Meyer"}
        />
      </Box>
    </Box>
  );
};

export default Home;
