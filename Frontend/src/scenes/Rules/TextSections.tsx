import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

interface LangProps {
  isDanish: boolean;
}

export const HOOK = ({ isDanish }: LangProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display="flex" justifyContent="center">
      <Typography
        variant="h5"
        color={colors.primary[100]}
        fontWeight="bold"
        children={
          isDanish
            ? "Meyer er et terningespil, hvori der indgår bluf"
            : "Meyer is a dice game about bluffing"
        }
      />
    </Box>
  );
};

export const INTRODUCTION = ({ isDanish }: LangProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const sentence1 = isDanish
    ? "I Meyer ruller man to terninger i mellem to raflebægere lagt oveni i hinanden og skjuler hvad man har rullet fra andre."
    : "In Meyer, you roll two dice in between to dice boxes (cups) stack on top of each other and you hide what you rolled from others.";

  const sentence2 = isDanish
    ? "Man kan vælge at tale sandt eller at bluffe om sit slag, dog hvis man vil tale sandt, skal man have slået højere end den foregående spiller."
    : "You can choose to be truthful or bluff about your roll, though if you wish to be truthful you have to have a higher roll than the previous player.";

  const sentence3 = isDanish
    ? "Dog har man også et tredje valg, hvis man ved, at ens bluf ikke vil virke: "
    : "Though you do have a third option if you know your bluff won't work: ";

  const sentence4 = isDanish
    ? 'Man kan rulle uden at kigge, give raflebægerne videre og sige "Dét eller derover".'
    : 'You can roll and without looking pass the dice boxes to the next person and say "Same roll or above".';

  const sentence5 = isDanish
    ? "I starten af din tur kan du vælge at teste den tidligere persons bluf: "
    : "In the start of your turn, you can choose to test the previous player's bluff: ";

  const sentence6 = isDanish
    ? "Hvis deres slag ikke stemmer overens med det, de sagde, så mister modstanderen et liv, ellers gør man selv."
    : "If their roll doesn't correspond with what they said then they lose a life, otherwise you do.";

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Typography
        children={
          sentence1 + sentence2 + sentence3 + sentence4 + sentence5 + sentence6
        }
      />
    </Box>
  );
};
