import { Box, Button, Typography } from "@mui/material";
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
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { getDiceRoll } from "../../utils/diceUtils";

interface Props {
  isDanish: boolean;
}

const RulesHealth = ({ isDanish }: Props) => {
  const queryMatches = useMediaQuery("only screen and (min-width: 600px)");
  const [currentHealths, setCurrentHealths] = useState([
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [hasHealthRolled, setHasHealthRolled] = useState([
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
  ]);
  const [hasClicked, setHasClicked] = useState(false);
  const [toHealthRoll, setToHealthRoll] = useState(false);

  function doCheck(queryMatches: boolean) {
    if (queryMatches) {
      return 79;
    } else {
      return 68;
    }
  }

  const leftWidthPercentage = doCheck(queryMatches);

  function _changePlayerInternal(value: number): void {
    let possibleNextPlayer =
      currentPlayer + value > 10
        ? 1
        : currentPlayer + value < 1
        ? 10
        : currentPlayer + value;

    while (currentHealths[possibleNextPlayer - 1] <= 0) {
      possibleNextPlayer =
        possibleNextPlayer + value > 10
          ? 1
          : possibleNextPlayer + value < 1
          ? 10
          : possibleNextPlayer + value;
    }

    setCurrentPlayer(possibleNextPlayer);
  }

  function nextPlayer(): void {
    _changePlayerInternal(1);
  }

  function previousPlayer(): void {
    _changePlayerInternal(-1);
  }

  function currentPlayerIsOnlyPlayer(): boolean {
    return (
      currentHealths.filter((value): value is number => value !== 0).length ===
      1
    );
  }

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
      {!toHealthRoll && !currentPlayerIsOnlyPlayer() && (
        <>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              children={"Previous"}
              onClick={previousPlayer}
            />
            <Button
              variant="contained"
              color="secondary"
              children={"Next"}
              onClick={nextPlayer}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              children={"Remove health"}
              onClick={() => {
                let newHealths = currentHealths.slice();
                newHealths[currentPlayer - 1]--;
                setCurrentHealths(newHealths);
                if (
                  newHealths[currentPlayer - 1] === 3 &&
                  !hasHealthRolled[currentPlayer - 1]
                ) {
                  hasHealthRolled[currentPlayer - 1] = true;
                  setToHealthRoll(true);
                } else if (newHealths[currentPlayer - 1] <= 0) {
                  nextPlayer();
                }
              }}
            />
          </Box>
        </>
      )}
      {toHealthRoll && (
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            children={"HealthRoll"}
            onClick={() => {
              let newHealths = currentHealths.slice();
              newHealths[currentPlayer - 1] = getDiceRoll();
              setCurrentHealths(newHealths);
              setToHealthRoll(false);
            }}
          />
        </Box>
      )}
      {currentPlayerIsOnlyPlayer() && (
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            children={"Reset"}
            onClick={() => {
              setCurrentHealths([6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
              setHasHealthRolled([
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
              ]);
            }}
          />
        </Box>
      )}
    </LeftChild>
  );

  const rightChild = (
    <RightChild widthPercentage={100 - leftWidthPercentage}>
      <Box
        position="-webkit-sticky"
        height="auto"
        alignSelf="flex-start"
        top="60px"
        sx={{ position: "sticky" }}
      >
        <PlayersHealthsDisplay
          isDanish={isDanish}
          currentHealths={currentHealths}
          currentPlayer={
            !currentPlayerIsOnlyPlayer() ? currentPlayer : undefined
          }
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
