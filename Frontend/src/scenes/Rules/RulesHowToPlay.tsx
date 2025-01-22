import { Box, Button, Typography, useTheme } from "@mui/material";
import {
  translateAction,
  translateButtonNewCurrent,
  translateButtonNewPrevious,
  translateHowToPlay1,
  translateHowToPlay10,
  translateHowToPlay11,
  translateHowToPlay12,
  translateHowToPlay13,
  translateHowToPlay14,
  translateHowToPlay15,
  translateHowToPlay16,
  translateHowToPlay17,
  translateHowToPlay19,
  translateHowToPlay20,
  translateHowToPlay2,
  translateHowToPlay3,
  translateHowToPlay4,
  translateHowToPlay5,
  translateHowToPlay6,
  translateHowToPlay7,
  translateHowToPlay8,
  translateHowToPlay9,
  translateHowToPlay18,
  translateDeletePrevious,
} from "../../utils/lang/Rules/langRulesHowToPlay";
import { RollWithName, getMeyerRoll } from "../../utils/diceUtils";
import { tokens } from "../../theme";
import { bluffChoices, isGreaterThanEqualTo } from "../../utils/gameLogic";
import { useState } from "react";

interface Props {
  isDanish: boolean;
}

const RulesHowToPlay = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [exampleRoll, setExampleRoll] = useState(43);
  const [previousDeclaredExampleRoll, setPreviousDeclaredExampleRoll] =
    useState(-1);

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
        children={<strong>{translateHowToPlay1(isDanish)}</strong>}
      />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={translateHowToPlay2(isDanish)}
      />
      <br />
      <Typography
        variant="h3"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={translateHowToPlay3(isDanish)}
      />
      <br />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateHowToPlay4(isDanish)}
            <br />
            {translateHowToPlay5(isDanish)}
          </>
        }
      />
      <br />
      <Box display="flex" justifyContent="center">
        <Button variant="contained" color="secondary">
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateAction(isDanish, "Check")}
          />
        </Button>
        <Box marginLeft="3px" />
        <Button variant="contained" color="secondary">
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateAction(isDanish, "Roll")}
          />
        </Button>
      </Box>
      <Typography
        fontSize="12px"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={translateHowToPlay6(isDanish)}
      />
      <br />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateHowToPlay7(isDanish)}
            <br />
            <br />
            {translateHowToPlay8(isDanish)}
          </>
        }
      />
      <br />
      <Typography
        fontSize="25px"
        fontStyle="normal"
        textTransform="none"
        component="span"
      >
        <RollWithName
          isDanish={isDanish}
          roll={exampleRoll}
          color={colors.blueAccent[100]}
          sideLength={30}
        />
      </Typography>
      <Box display="flex" justifyContent="center">
        <Button variant="contained" color="secondary">
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateAction(isDanish, "Truth")}
          />
        </Button>
        <Box marginLeft="3px" />
        <Button variant="contained" color="secondary">
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateAction(isDanish, "Bluff")}
          />
        </Button>
        <Box marginLeft="3px" />
        <Button variant="contained" color="secondary">
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateAction(isDanish, "SameRollOrHigher")}
          />
        </Button>
      </Box>
      <Typography
        fontSize="12px"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={translateHowToPlay9(isDanish)}
      />
      <Typography
        fontSize="12px"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={translateHowToPlay10(isDanish)}
      />
      <br />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateHowToPlay11(isDanish)}
            <br />
            <br />
            {translateHowToPlay12(isDanish)}
            <strong>{translateHowToPlay13(isDanish)}</strong>
            {translateHowToPlay14(isDanish)}
            <br />
            <br />
            {translateHowToPlay15(isDanish, exampleRoll)}
            <br />
            {translateHowToPlay16(isDanish)}
          </>
        }
      />
      <br />
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
            >
              {previousDeclaredExampleRoll > -1 && (
                <Typography
                  fontSize="20px"
                  fontStyle="normal"
                  textTransform="none"
                  display="flex"
                  flexDirection="column"
                  children={
                    <>
                      <Box display="flex" justifyContent="center">
                        {
                          <>
                            {translateHowToPlay17(isDanish)}
                            <br />
                            {translateHowToPlay18(isDanish)}
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
            <Box
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
            >
              <Typography
                fontSize="20px"
                fontStyle="normal"
                textTransform="none"
                display="flex"
                flexDirection="column"
                children={
                  <>
                    <Box display="flex" justifyContent="center">
                      {translateHowToPlay19(isDanish)}
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
                onClick={() =>
                  setExampleRoll(getMeyerRollNoCheers(exampleRoll))
                }
                children={translateButtonNewCurrent(isDanish)}
              />
            </Box>
          </Box>

          <br />
          <Box display="flex" justifyContent="center">
            <Box
              display="flex"
              justifyContent="center"
              width="100%"
              flexWrap="wrap"
            >
              {isGreaterThanEqualTo(
                exampleRoll,
                previousDeclaredExampleRoll
              ) && (
                <Button variant="contained" color="secondary">
                  <Typography
                    fontSize="20px"
                    fontStyle="normal"
                    textTransform="none"
                    children={translateAction(isDanish, "Truth")}
                  />
                </Button>
              )}

              <Box marginLeft="3px" />
              {exampleBluffChoices(
                exampleRoll,
                previousDeclaredExampleRoll
              ).map((bluff) => (
                <>
                  <Button variant="contained" color="secondary">
                    <Typography
                      fontSize="20px"
                      fontStyle="normal"
                      textTransform="none"
                      component="span"
                    >
                      <RollWithName
                        isDanish={isDanish}
                        roll={bluff}
                        color={colors.blueAccent[100]}
                        sideLength={16}
                      />
                    </Typography>
                  </Button>
                  <Box marginLeft="3px" />
                </>
              ))}
              {previousDeclaredExampleRoll !== -1 && (
                <Button variant="contained" color="secondary">
                  <Typography
                    fontSize="20px"
                    fontStyle="normal"
                    textTransform="none"
                    children={translateAction(isDanish, "SameRollOrHigher")}
                  />
                </Button>
              )}
            </Box>
          </Box>
          <br />
          <Typography
            fontSize="20px"
            fontStyle="normal"
            textTransform="none"
            children={translateHowToPlay20(isDanish)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RulesHowToPlay;
