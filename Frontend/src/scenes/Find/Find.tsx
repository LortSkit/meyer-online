import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import FindHeading from "./FindHeading";
interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />
    </Box>
  );
};

export default Find;
