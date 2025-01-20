import { Box, useTheme } from "@mui/material";
import { RollWithName } from "../../utils/diceUtils";
import { tokens } from "../../theme";

interface LangProps {
  isDanish: boolean;
}

export const RulesPossibleRolls = ({ isDanish }: LangProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const space = "5px";

  // TODO: MOVE TEXT TO LANG!
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box display="flex" justifyContent="center">
        {isDanish
          ? "Her er alle de slag, man kan rulle, fra højest til lavest:"
          : "Here are all the possible rolls sorted  from highest to lowest:"}
      </Box>
      <Box p={1} />
      {/* SPECIAL */}
      <Box display="flex" justifyContent="center">
        {isDanish
          ? "Fællesskålsslaget (alle skal drikke), som kan redde dig, da der starter en ny runde, hvis du ruller den her"
          : "The Roll of Cheers (everyone must drink), which can also save you as rolling this will start a new round"}
      </Box>
      <RollWithName
        isDanish={isDanish}
        roll={32}
        color={colors.blueAccent[100]}
        sideLength={12}
      />
      <Box p={1} />

      <Box display="flex" justifyContent="center">
        {isDanish
          ? 'Det højeste slag er "meyer"'
          : 'The highest roll is "meyer"'}
      </Box>
      <RollWithName
        isDanish={isDanish}
        roll={21}
        color={colors.blueAccent[100]}
        sideLength={12}
      />
      <Box p={1} />

      <Box display="flex" justifyContent="center">
        {isDanish
          ? 'Det næsthøjeste slag er "lille-meyer"'
          : 'The second highest roll is "meyer"'}
      </Box>
      <RollWithName
        isDanish={isDanish}
        roll={31}
        color={colors.blueAccent[100]}
        sideLength={12}
      />
      <Box p={1} />
      {/* PAIRS */}
      <Box display="flex" justifyContent="center">
        {isDanish
          ? "Parrene er de højeste ikke-speciele slag"
          : "The pairs are the highest non-special rolls"}
      </Box>
      <Box display="flex" justifyContent="center">
        {[66, 55, 44, 33, 22, 11].map((roll) => (
          <Box display="flex" justifyContent="center">
            <RollWithName
              isDanish={isDanish}
              roll={roll}
              color={colors.blueAccent[100]}
              sideLength={12}
            />

            <Box marginLeft={space} />
          </Box>
        ))}
      </Box>
      <Box p={1} />

      {/* BORING ROLLS */}
      <Box display="flex" justifyContent="center">
        {isDanish
          ? "Og til sidst de lave, almindelige slag"
          : "And finally the low, common rolls"}
      </Box>
      <Box display="flex" justifyContent="center">
        {[65, 64, 63, 62, 61, 54, 53, 52, 51, 43, 42, 41].map((roll) => (
          <Box display="flex" justifyContent="center">
            <RollWithName
              isDanish={isDanish}
              roll={roll}
              color={colors.blueAccent[100]}
              sideLength={12}
            />

            <Box marginLeft={space} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
