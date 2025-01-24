import { Box, Typography } from "@mui/material";
import {
  translateHealthHeading,
  translateHealthText1,
  translateHealthText2,
  translateHealthText3,
  translateHealthText4,
  translateHealthText5,
  translateHealthText6,
} from "../../utils/lang/Rules/langRulesHealth";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import {
  LeftChild,
  RightChild,
} from "../../components/CenteredPage/PageChildren";
import PlayersHealthsDisplay from "../../components/game/PlayersHealthsDisplay";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  isDanish: boolean;
}

const RulesHealth = ({ isDanish }: Props) => {
  const queryMatches = useMediaQuery("only screen and (min-width: 600px)");
  const [currentHealths, setCurrentHealths] = useState([] as number[]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  function doCheck(queryMatches: boolean) {
    if (queryMatches) {
      if (currentHealths.length !== 10) {
        setCurrentHealths([6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
      }

      return 79;
    } else {
      if (currentHealths.length !== 25) {
        setCurrentHealths([
          6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
          6, 6,
        ]);
      }
      return 68;
    }
  }

  const leftWidthPercentage = doCheck(queryMatches);

  const leftChild = (
    <LeftChild widthPercentage={leftWidthPercentage}>
      <Typography
        fontSize={`18px`}
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateHealthText1(isDanish)}
            <br />
            {translateHealthText2(isDanish)}
            <br />
            {translateHealthText3(isDanish)}
            <strong>{translateHealthText4(isDanish)}</strong>
            {translateHealthText5(isDanish)}
            <br />
            {translateHealthText6(isDanish)}
            <br />
          </>
        }
      />
    </LeftChild>
  );

  const rightChild = (
    <RightChild widthPercentage={100 - leftWidthPercentage}>
      <Box display="flex" justifyContent="left" flexBasis="100%">
        <PlayersHealthsDisplay
          isDanish={isDanish}
          currentHealths={currentHealths}
          currentPlayer={currentPlayer}
        />
      </Box>
    </RightChild>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      flexBasis="100%"
      component="span"
    >
      <Typography
        variant="h2"
        fontStyle="normal"
        textTransform="none"
        style={{ display: "flex", justifyContent: "center" }}
        children={<strong>{translateHealthHeading(isDanish)}</strong>}
      />
      <CenteredPage
        leftChild={leftChild}
        middleWidthPercentage={0}
        rightChild={rightChild}
      />
    </Box>
  );
};

export default RulesHealth;
