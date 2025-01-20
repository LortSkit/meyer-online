import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import {
  translateHomeWelcome,
  translateHomeCreate,
  translateHomeFind,
  translateHomeRules,
} from "../../utils/lang/Home/langHomeText";

interface Props {
  isDanish: boolean;
}

const HomeText = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h3"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={translateHomeWelcome(isDanish)}
          />
        </Box>
        <Box paddingTop="4px" />
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h6"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={translateHomeCreate(isDanish)}
          />
        </Box>
        <Box paddingTop="4px" />
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h6"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={translateHomeFind(isDanish)}
          />
        </Box>
        <Box paddingTop="4px" />
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h6"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={translateHomeRules(isDanish)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomeText;
