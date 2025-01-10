import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeHeading from "./HomeHeading";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <HomeHeading isDanish={isDanish} />
    </Box>
  );
};

export default Home;
