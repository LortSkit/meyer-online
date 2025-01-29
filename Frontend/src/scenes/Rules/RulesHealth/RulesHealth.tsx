import { Box, Typography } from "@mui/material";
import {
  translateHealthHeading,
  translateHealthText1,
  translateHealthText2,
  translateHealthText3,
  translateHealthText4,
  translateHealthText5,
  translateHealthText6,
} from "../../../utils/lang/Rules/RulesHealth/langRulesHealth";
import CenteredPage from "../../../components/CenteredPage/CenteredPage";
import {
  LeftChild,
  RightChild,
} from "../../../components/CenteredPage/PageChildren";
import PlayersHealthsDisplay from "../../../components/game/PlayersHealthsDisplay";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import HealthInterractiveButtons from "./HealthInterractiveButtons";

interface Props {
  isDanish: boolean;
  currentPlayer: number;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setPreviousPlayer: React.Dispatch<React.SetStateAction<number>>;
}

const RulesHealth = ({
  isDanish,
  currentPlayer,
  setCurrentPlayer,
  setPreviousPlayer,
}: Props) => {
  const queryMatches600 = useMediaQuery("only screen and (min-width: 600px)");
  const queryMatches1200 = useMediaQuery("only screen and (min-width: 1200px)");

  const [hasClicked, setHasClicked] = useState(false);
  const [toHealthRoll, setToHealthRoll] = useState(false);

  function stickyDisplacementByQuery(queryMatches600: boolean): string {
    if (queryMatches600) {
      return "0px";
    } else {
      return "60px";
    }
  }

  function isStickyByQuery(queryMatches600: boolean) {
    if (queryMatches600) {
      return undefined;
    } else {
      return "sticky";
    }
  }

  function stickyPaddingByQuery(queryMatches600: boolean): string {
    if (queryMatches600) {
      return "0px";
    } else {
      if (!hasClicked) {
        return "130px";
      }
      return "85px";
    }
  }

  function widthByQuery(queryMatches600: boolean) {
    if (queryMatches600) {
      return 79;
    } else {
      return 67;
    }
  }

  function initHealthByQuery(
    queryMatches600: boolean,
    queryMatches1200: boolean
  ) {
    if (queryMatches1200) {
      return {
        healthInit: [6, 6, 6],
        hasHealthRolledInit: [false, false, false],
        numberOfPlayers: 3,
      };
    } else if (queryMatches600) {
      return {
        healthInit: [6, 6, 6, 6, 6, 6],
        hasHealthRolledInit: [false, false, false, false, false, false],
        numberOfPlayers: 6,
      };
    } else {
      return {
        healthInit: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        hasHealthRolledInit: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
        numberOfPlayers: 10,
      };
    }
  }

  const [currentHealths, setCurrentHealths] = useState(
    initHealthByQuery(queryMatches600, queryMatches1200)["healthInit"]
  );
  const [hasHealthRolled, setHasHealthRolled] = useState(
    initHealthByQuery(queryMatches600, queryMatches1200)["hasHealthRolledInit"]
  );

  const [numberOfPlayers, setNumberOfPlayers] = useState(
    initHealthByQuery(queryMatches600, queryMatches1200)["numberOfPlayers"]
  );

  function currentPlayerIsOnlyPlayer(): boolean {
    return (
      currentHealths.filter((value): value is number => value !== 0).length ===
      1
    );
  }

  const leftChild = (
    <LeftChild widthPercentage={widthByQuery(queryMatches600)}>
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
    <RightChild widthPercentage={100 - widthByQuery(queryMatches600)}>
      <Box
        position="-webkit-sticky"
        height="auto"
        alignSelf="flex-start"
        top={stickyDisplacementByQuery(queryMatches600)}
        paddingBottom={stickyPaddingByQuery(queryMatches600)}
        sx={{ position: isStickyByQuery(queryMatches600) }}
      >
        <PlayersHealthsDisplay
          isDanish={isDanish}
          currentHealths={currentHealths}
          currentPlayer={
            !currentPlayerIsOnlyPlayer() ? currentPlayer : undefined
          }
        />
      </Box>
      <HealthInterractiveButtons
        isDanish={isDanish}
        currentHealths={currentHealths}
        currentPlayer={currentPlayer}
        hasClicked={hasClicked}
        hasHealthRolled={hasHealthRolled}
        numberOfPlayers={numberOfPlayers}
        queryMatches600={queryMatches600}
        queryMatches1200={queryMatches1200}
        toHealthRoll={toHealthRoll}
        currentPlayerIsOnlyPlayer={currentPlayerIsOnlyPlayer}
        initHealthByQuery={initHealthByQuery}
        setCurrentHealths={setCurrentHealths}
        setCurrentPlayer={setCurrentPlayer}
        setHasClicked={setHasClicked}
        setHasHealthRolled={setHasHealthRolled}
        setNumberOfPlayers={setNumberOfPlayers}
        setPreviousPlayer={setPreviousPlayer}
        setToHealthRoll={setToHealthRoll}
      />
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
