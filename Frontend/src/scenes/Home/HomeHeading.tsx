import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
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
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        children={translateHomeWelcome(isDanish)}
      />
    </Box>
  );
};

export default HomeHeading;
