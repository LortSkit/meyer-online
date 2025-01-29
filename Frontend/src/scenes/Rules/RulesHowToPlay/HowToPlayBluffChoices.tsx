import { Box, Button, useTheme } from "@mui/material";
import { HowToPlayRoll, HowToPlayText } from "./HowToPlayTypographies";
import { getMeyerRoll, RollWithName } from "../../../utils/diceUtils";
import { tokens } from "../../../theme";
import React, { useState } from "react";
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
  translateHowToPlayPreviousMissing,
  translateClickMePlease,
} from "../../../utils/lang/Rules/RulesHowToPlay/langHowToPlayBluffChoices";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useMediaQuery } from "usehooks-ts";

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

  const queryMatches = useMediaQuery("only screen and (min-width: 600px)");

  const [hasClicked, setHasClicked] = useState(false);

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

  const clickMePleaseSize = 30;
  function paddingForClickMePleaseByQuery(queryMatches: boolean): string {
    if (queryMatches) {
      if (isDanish) {
        if (!hasClicked) {
          return "0px";
        } else if (previousDeclaredExampleRoll === -1) {
          return `${clickMePleaseSize * 2.76}px`;
        } else {
          return `${clickMePleaseSize * 1.63}px`;
        }
      }

      if (!hasClicked) {
        return "0px";
      } else if (previousDeclaredExampleRoll === -1) {
        return `${clickMePleaseSize * 3.303}px`;
      } else {
        return `${clickMePleaseSize * 2.045}px`;
      }
    } else {
      if (!hasClicked) {
        return "0px";
      }
      return `${clickMePleaseSize * 0.1}px`;
    }
  }

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" flexDirection="column">
        {/* PREVIOUS AND CURRENT ROLL BUTTONS */}
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="flex-end" flexDirection="column">
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
                  {previousDeclaredExampleRoll > -1 && (
                    <RollWithName
                      isDanish={isDanish}
                      roll={previousDeclaredExampleRoll}
                      color={colors.blueAccent[100]}
                      sideLength={25}
                    />
                  )}
                  {previousDeclaredExampleRoll === -1 && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      paddingTop="12.5px"
                      paddingBottom="12.5px"
                    >
                      {translateHowToPlayPreviousMissing(isDanish)}
                    </Box>
                  )}
                </>
              }
            />
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setPreviousDeclaredExampleRoll(
                    getMeyerRollNoCheers(previousDeclaredExampleRoll)
                  );
                  setHasClicked(true);
                }}
                children={translateButtonNewPrevious(isDanish)}
              />
              {previousDeclaredExampleRoll !== -1 && (
                <>
                  <Box paddingLeft="4px" />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setPreviousDeclaredExampleRoll(-1);
                      setHasClicked(true);
                    }}
                    children={translateDeletePrevious(isDanish)}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexDirection="column"
            paddingLeft={paddingForClickMePleaseByQuery(queryMatches)}
            paddingRight={paddingForClickMePleaseByQuery(queryMatches)}
          >
            {!hasClicked && (
              <HowToPlayText
                fontSize={clickMePleaseSize}
                children={
                  <>
                    <ArrowBack />
                    {translateClickMePlease(isDanish)}
                    <ArrowForward />
                  </>
                }
              />
            )}
          </Box>
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
        {/* ACTION AND BLUFF CHOICES */}
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
                <span key={bluff}>
                  <BluffButton isDanish={isDanish} bluff={bluff} />
                  <Box marginLeft="3px" />
                </span>
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
