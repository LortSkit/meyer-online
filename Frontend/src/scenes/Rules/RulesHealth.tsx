import { Box, Typography } from "@mui/material";
import { translateHealth } from "../../utils/lang/Rules/langRulesHealth";

interface Props {
  isDanish: boolean;
}

const RulesHealth = ({ isDanish }: Props) => {
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
        children={<strong>{translateHealth(isDanish)}</strong>}
      />
    </Box>
  );
};

export default RulesHealth;
