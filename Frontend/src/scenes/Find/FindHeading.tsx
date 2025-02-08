import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import { tokens } from "../../theme";
import { translateFind } from "../../utils/lang/Find/langFindHeading";

interface Props {
  isDanish: boolean;
}

const FindHeading = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Typography
        variant="h1"
        color={colors.blueAccent[100]}
        fontWeight="bold"
        children={translateFind(isDanish)}
      />
    </Box>
  );
};

export default FindHeading;
