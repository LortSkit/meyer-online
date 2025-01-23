import { Box, useTheme } from "@mui/material";
import {
  translateHowToPlayHeading,
  translateHowToPlayIntro,
  translateHowToPlayHook,
  translateHowToPlayCheckRoll1,
  translateHowToPlayCheckRoll2,
  translateHowToPlayCheckRollSmall,
  translateHowToPlayCheckRoll3,
  translateHowToPlayCheckRoll4,
  translateHowToPlayTruthBluffSameSmall1,
  translateHowToPlayTruthBluffSameSmall2,
  translateHowToPlayTruthBluffSame1,
  translateHowToPlayTruthBluffSame2,
  translateHowToPlayTruthBluffSame3,
  translateHowToPlayTruthBluffSame4,
  translateHowToPlayTruthBluffSame5,
  translateHowToPlayTruthBluffSame6,
  translateHowToPlayEnd,
} from "../../../utils/lang/Rules/RulesHowToPlay/langRulesHowToPlay";
import { RollWithName } from "../../../utils/diceUtils";
import { tokens } from "../../../theme";
import { useState } from "react";
import {
  HowToPlayHeading,
  HowToPlayHook,
  HowToPlayRoll,
  HowToPlaySmallText,
  HowToPlayText,
} from "./HowToPlayTypographies";
import ActionButton from "../../../components/game/ActionButton";
import HowToPlayBluffChoices from "./HowToPlayBluffChoices";

interface Props {
  isDanish: boolean;
}

const RulesHowToPlay = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [exampleRoll, setExampleRoll] = useState(43);
  const [previousDeclaredExampleRoll, setPreviousDeclaredExampleRoll] =
    useState(-1);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      component="span"
    >
      <HowToPlayHeading
        children={<strong>{translateHowToPlayHeading(isDanish)}</strong>}
      />
      <HowToPlayText
        fontSize={18}
        children={translateHowToPlayIntro(isDanish)}
      />
      <br />
      <HowToPlayHook children={translateHowToPlayHook(isDanish)} />
      <br />

      {/* CHECK AND ROLL */}
      <HowToPlayText
        fontSize={18}
        children={
          <>
            {translateHowToPlayCheckRoll1(isDanish)}
            <br />
            {translateHowToPlayCheckRoll2(isDanish)}
          </>
        }
      />
      <br />
      <Box display="flex" justifyContent="center">
        <ActionButton isDanish={isDanish} action="Check" />
        <Box marginLeft="3px" />
        <ActionButton isDanish={isDanish} action="Roll" />
      </Box>
      <HowToPlaySmallText
        children={translateHowToPlayCheckRollSmall(isDanish)}
      />
      <br />
      <HowToPlayText
        fontSize={18}
        children={
          <>
            {translateHowToPlayCheckRoll3(isDanish)}
            <br />
            <br />
            {translateHowToPlayCheckRoll4(isDanish)}
          </>
        }
      />
      <br />

      {/* TRUTH, BLUFF, SAMEROLLORHIGHER */}
      <HowToPlayRoll
        fontSize={25}
        children={
          <RollWithName
            isDanish={isDanish}
            roll={exampleRoll}
            color={colors.blueAccent[100]}
            sideLength={30}
          />
        }
      />
      <Box display="flex" justifyContent="center">
        <ActionButton isDanish={isDanish} action="Truth" />
        <Box marginLeft="3px" />
        <ActionButton isDanish={isDanish} action="Bluff" />
        <Box marginLeft="3px" />
        <ActionButton isDanish={isDanish} action="SameRollOrHigher" />
      </Box>
      <HowToPlaySmallText
        children={translateHowToPlayTruthBluffSameSmall1(isDanish)}
      />
      <HowToPlaySmallText
        children={translateHowToPlayTruthBluffSameSmall2(isDanish)}
      />
      <br />
      <HowToPlayText
        fontSize={18}
        children={
          <>
            {translateHowToPlayTruthBluffSame1(isDanish)}
            <br />
            <br />
            {translateHowToPlayTruthBluffSame2(isDanish)}
            <strong>{translateHowToPlayTruthBluffSame3(isDanish)}</strong>
            {translateHowToPlayTruthBluffSame4(isDanish)}
            <br />
            <br />
            {translateHowToPlayTruthBluffSame5(isDanish, exampleRoll)}
            <br />
            {translateHowToPlayTruthBluffSame6(isDanish)}
          </>
        }
      />
      <br />

      {/* BLUFF CHOICES */}
      <HowToPlayBluffChoices
        isDanish={isDanish}
        exampleRoll={exampleRoll}
        previousDeclaredExampleRoll={previousDeclaredExampleRoll}
        setExampleRoll={setExampleRoll}
        setPreviousDeclaredExampleRoll={setPreviousDeclaredExampleRoll}
      />

      {/* END TEXT */}
      <HowToPlayText fontSize={20} children={translateHowToPlayEnd(isDanish)} />
    </Box>
  );
};

export default RulesHowToPlay;
