import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { translateHomeWelcome } from "../../utils/lang/Home/langHomeHeading";

interface Props {
  isDanish: boolean;
}

const HomeHeading = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Typography
        variant="h1"
        color={colors.blueAccent[100]}
        fontWeight="bold"
        children={translateHomeWelcome(isDanish)}
      />
    </Box>
  );
};

export default HomeHeading;
