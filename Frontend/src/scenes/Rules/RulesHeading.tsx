import { useTheme, Box, Typography } from "@mui/material";
import { tokens } from "../../theme";
import {
  translateRulesHeading1,
  translateRulesHeading2,
} from "../../utils/lang/Rules/langRulesHeading";

interface Props {
  isDanish: boolean;
}

const RulesHeading = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Typography component="span">
        <Typography
          variant="h1"
          color={colors.blueAccent[100]}
          fontWeight="bold"
          style={{ display: "flex", justifyContent: "center" }}
          children={translateRulesHeading1(isDanish)}
        />
        <Typography
          variant="h3"
          fontStyle="normal"
          textTransform="none"
          style={{ display: "flex", justifyContent: "center" }}
          children={translateRulesHeading2(isDanish)}
        />
      </Typography>
    </Box>
  );
};

export default RulesHeading;
