import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { translateRules } from "../../utils/lang/Rules/langRulesHeading";

interface Props {
  isDanish: boolean;
}

const RulesHeading = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Typography
        variant="h1"
        color={colors.blueAccent[100]}
        fontWeight="bold"
        children={translateRules(isDanish)}
      />
    </Box>
  );
};

export default RulesHeading;
