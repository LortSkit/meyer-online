import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { CasinoOutlined } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import { Dice } from "../../components/icons/DiceIcons";
import { getRoll, Roll, RollWithName } from "../../utils/diceUtils";
import { useState } from "react";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [roll, setRoll] = useState(0);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column" overflow="auto">
      {/* HEADING */}
      <Box display="flex" justifyContent="center" p={2}>
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h1"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={isDanish ? "Regler" : "Rules"}
          />
        </Box>
      </Box>
      {/* HOOK */}
      <Box display="flex" justifyContent="center" p={2}>
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
      </Box>
      {/* POSSIBLE ROLLS */}
      <Box
        display="flex"
        justifyContent="center"
        p={2}
        flexDirection="column"
        flexBasis="100%"
      >
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
          <RollWithName
            roll={66}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={55}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={44}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={33}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={22}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={11}
            color={colors.blueAccent[100]}
            sideLength={12}
          />
        </Box>
        <Box p={1} />

        {/* BORING ROLLS */}
        <Box display="flex" justifyContent="center">
          {isDanish
            ? "Og til sidst de lave, almindelige slag"
            : "And finally the low, common rolls"}
        </Box>
        <Box display="flex" justifyContent="center">
          {/* 60s */}
          <RollWithName
            roll={65}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={64}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={63}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={62}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={61}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          {/* 50s */}
          <Box marginLeft="3px" />
          <RollWithName
            roll={54}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={53}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={52}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={51}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          {/* 40s */}
          <Box marginLeft="3px" />
          <RollWithName
            roll={43}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={42}
            color={colors.blueAccent[100]}
            sideLength={12}
          />

          <Box marginLeft="3px" />
          <RollWithName
            roll={41}
            color={colors.blueAccent[100]}
            sideLength={12}
          />
        </Box>
      </Box>
      {/* Random Roll */}
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center" flexBasis="100%">
          {roll == 0 && "Click below for random roll!"}
          {roll != 0 && (
            <RollWithName
              roll={roll}
              color={colors.blueAccent[100]}
              sideLength={12}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="center" flexBasis="100%">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setRoll(getRoll());
            }}
          >
            Roll!
          </Button>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Rules;
