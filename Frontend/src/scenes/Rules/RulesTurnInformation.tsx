import { Box, Typography } from "@mui/material";
import { translateTurnInformation } from "../../utils/lang/Rules/langRulesTurnInformation";

interface Props {
  isDanish: boolean;
}

const RulesTurnInformation = ({ isDanish }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      component="span"
    >
      <Typography
        variant="h2"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={<strong>{translateTurnInformation(isDanish)}</strong>}
      />
    </Box>
  );
};

export default RulesTurnInformation;
