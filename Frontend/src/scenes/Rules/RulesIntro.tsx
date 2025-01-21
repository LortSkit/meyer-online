import { Box, Typography } from "@mui/material";
import { translateRulesIntro } from "../../utils/lang/Rules/langRulesIntro";

interface Props {
  isDanish: boolean;
}

const RulesIntro = ({ isDanish }: Props) => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={<>{translateRulesIntro(isDanish)}</>}
      />
    </Box>
  );
};

export default RulesIntro;
