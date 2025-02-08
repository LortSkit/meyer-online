import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  translateRulesIntro1,
  translateRulesIntro2,
  translateRulesIntro3,
} from "../../../utils/lang/Rules/PossibleRolls/langPossibleRollsIntro";

interface Props {
  isDanish: boolean;
}

const PossibleRollsIntro = ({ isDanish }: Props) => {
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
        children={<strong>{translateRulesIntro1(isDanish)}</strong>}
      />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateRulesIntro2(isDanish)}
            <br />
            {translateRulesIntro3(isDanish)}
          </>
        }
      />
    </Box>
  );
};

export default PossibleRollsIntro;
