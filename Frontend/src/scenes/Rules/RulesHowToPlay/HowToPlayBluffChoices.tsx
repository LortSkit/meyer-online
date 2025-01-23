import { Box, Button, useTheme } from "@mui/material";
import { HowToPlayRoll } from "./HowToPlayTypographies";
import { getMeyerRoll, RollWithName } from "../../../utils/diceUtils";
import { tokens } from "../../../theme";
import React from "react";
import { bluffChoices, isGreaterThanEqualTo } from "../../../utils/gameLogic";
import ActionButton from "../../../components/game/ActionButton";
import BluffButton from "../../../components/game/BluffButton";
import {
  translateButtonNewCurrent,
  translateButtonNewPrevious,
  translateDeletePrevious,
  translateHowToPlayPreviousName1,
  translateHowToPlayPreviousName2,
  translateHowToPlayCurrentName,
} from "../../../utils/lang/Rules/RulesHowToPlay/langHowToPlayBluffChoices";

interface Props {
  isDanish: boolean;
  exampleRoll: number;
  previousDeclaredExampleRoll: number;
  setExampleRoll: React.Dispatch<React.SetStateAction<number>>;
  setPreviousDeclaredExampleRoll: React.Dispatch<React.SetStateAction<number>>;
}

const HowToPlayBluffChoices = ({
  isDanish,
  exampleRoll,
  previousDeclaredExampleRoll,
  setExampleRoll,
  setPreviousDeclaredExampleRoll,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function exampleBluffChoices(
    exampleRoll: number,
    previousDeclaredExampleRoll: number
  ): number[] {
    const turn = previousDeclaredExampleRoll > -1 ? 2 : 1;

    return bluffChoices(exampleRoll, previousDeclaredExampleRoll, turn);
  }

  function getMeyerRollNoCheers(previousRoll: number): number {
    let roll = getMeyerRoll();
    while (roll == 32 || roll == previousRoll) {
      roll = getMeyerRoll();
    }
    return roll;
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="flex-end" flexDirection="column">
            {previousDeclaredExampleRoll > -1 && (
              <HowToPlayRoll
                fontSize={20}
                children={
                  <>
                    <Box display="flex" justifyContent="center">
                      {
                        <>
                          {translateHowToPlayPreviousName1(isDanish)}
                          <br />
                          {translateHowToPlayPreviousName2(isDanish)}
                        </>
                      }
                    </Box>
                    <RollWithName
                      isDanish={isDanish}
                      roll={previousDeclaredExampleRoll}
                      color={colors.blueAccent[100]}
                      sideLength={25}
                    />
                  </>
                }
              />
            )}
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  setPreviousDeclaredExampleRoll(
                    getMeyerRollNoCheers(previousDeclaredExampleRoll)
                  )
                }
                children={translateButtonNewPrevious(isDanish)}
              />
              {previousDeclaredExampleRoll !== -1 && (
                <>
                  <Box paddingLeft="4px" />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setPreviousDeclaredExampleRoll(-1)}
                    children={translateDeletePrevious(isDanish)}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box paddingLeft="20px" />
          <Box display="flex" justifyContent="flex-end" flexDirection="column">
            <HowToPlayRoll
              fontSize={20}
              children={
                <>
                  <Box display="flex" justifyContent="center">
                    {translateHowToPlayCurrentName(isDanish)}
                  </Box>
                  <RollWithName
                    isDanish={isDanish}
                    roll={exampleRoll}
                    color={colors.blueAccent[100]}
                    sideLength={25}
                  />
                </>
              }
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setExampleRoll(getMeyerRollNoCheers(exampleRoll))}
              children={translateButtonNewCurrent(isDanish)}
            />
          </Box>
        </Box>

        <br />
        <Box display="flex" justifyContent="center" flexDirection="column">
          {isGreaterThanEqualTo(exampleRoll, previousDeclaredExampleRoll) && (
            <>
              <Box display="flex" justifyContent="center">
                <ActionButton isDanish={isDanish} action="Truth" />
              </Box>
              <Box paddingBottom="5px" />
            </>
          )}
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            flexWrap="wrap"
          >
            <Box marginLeft="3px" />
            {exampleBluffChoices(exampleRoll, previousDeclaredExampleRoll).map(
              (bluff) => (
                <>
                  <BluffButton isDanish={isDanish} bluff={bluff} />
                  <Box marginLeft="3px" />
                </>
              )
            )}
          </Box>
          {previousDeclaredExampleRoll !== -1 && (
            <>
              <Box paddingBottom="5px" />
              <Box display="flex" justifyContent="center">
                <ActionButton isDanish={isDanish} action="SameRollOrHigher" />
              </Box>
            </>
          )}
        </Box>
        <br />
      </Box>
    </Box>
  );
};

export default HowToPlayBluffChoices;
