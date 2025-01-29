import { Box, Button, Typography } from "@mui/material";
import {
  translateAction,
  translateClickMePlease,
  translateRemoveHealth,
  translateReset,
} from "../../../utils/lang/Rules/RulesHealth/langHealthInterractiveButtons";
import {
  ArrowBackIosNew,
  ArrowDownward,
  ArrowForwardIos,
} from "@mui/icons-material";
import { getDiceRoll } from "../../../utils/diceUtils";

interface Props {
  isDanish: boolean;
  currentHealths: number[];
  currentPlayer: number;
  hasClicked: boolean;
  hasHealthRolled: boolean[];
  numberOfPlayers: number;
  queryMatches600: boolean;
  queryMatches1200: boolean;
  toHealthRoll: boolean;
  currentPlayerIsOnlyPlayer: () => boolean;
  initHealthByQuery: (
    queryMatches600: boolean,
    queryMatches1200: boolean
  ) => {
    healthInit: number[];
    hasHealthRolledInit: boolean[];
    numberOfPlayers: number;
  };
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  setHasClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setHasHealthRolled: React.Dispatch<React.SetStateAction<boolean[]>>;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
  setPreviousPlayer: React.Dispatch<React.SetStateAction<number>>;
  setToHealthRoll: React.Dispatch<React.SetStateAction<boolean>>;
}

const HealthInterractiveButtons = ({
  isDanish,
  currentHealths,
  currentPlayer,
  hasClicked,
  hasHealthRolled,
  numberOfPlayers,
  queryMatches600,
  queryMatches1200,
  toHealthRoll,
  currentPlayerIsOnlyPlayer,
  initHealthByQuery,
  setCurrentHealths,
  setCurrentPlayer,
  setHasClicked,
  setHasHealthRolled,
  setNumberOfPlayers,
  setPreviousPlayer,
  setToHealthRoll,
}: Props) => {
  function clickPaddingByQuery(queryMatches600: boolean, isDanish: boolean) {
    if (queryMatches600) {
      if (isDanish) {
        return "25px";
      } else {
        return "18px";
      }
    } else {
      if (isDanish) {
        return "17px";
      } else {
        return "2px";
      }
    }
  }

  function removeLifePadding(queryMatches600: boolean, isDanish: boolean) {
    if (queryMatches600) {
      if (isDanish) {
        return "24px";
      } else {
        return "13.5px";
      }
    } else {
      if (isDanish) {
        return "17.5px";
      } else {
        return "10px";
      }
    }
  }

  function rollNewLifePadding(queryMatches600: boolean, isDanish: boolean) {
    if (queryMatches600) {
      if (isDanish) {
        return "24px";
      } else {
        return "13.5px";
      }
    } else {
      return "10px";
    }
  }

  function _changePlayerInternal(value: number): void {
    setHasClicked(true);
    setPreviousPlayer(currentPlayer);
    let possibleNextPlayer =
      currentPlayer + value > numberOfPlayers
        ? 1
        : currentPlayer + value < 1
        ? numberOfPlayers
        : currentPlayer + value;

    while (currentHealths[possibleNextPlayer - 1] <= 0) {
      possibleNextPlayer =
        possibleNextPlayer + value > numberOfPlayers
          ? 1
          : possibleNextPlayer + value < 1
          ? numberOfPlayers
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

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      flexDirection="column"
      flexBasis="100%"
    >
      {!hasClicked && (
        <Box display="flex" flexDirection="column">
          <Typography
            fontSize="18px"
            fontStyle="normal"
            textTransform="none"
            style={{
              display: "flex",
              justifyContent: "left",
              paddingLeft: clickPaddingByQuery(queryMatches600, isDanish),
            }}
            children={translateClickMePlease(isDanish)}
          />
          <Box display="flex">
            <Box paddingLeft="22px" />
            <ArrowDownward />
            <Box paddingLeft="42px" />
            <ArrowDownward />
          </Box>
        </Box>
      )}
      {!toHealthRoll && !currentPlayerIsOnlyPlayer() && (
        <Box display="flex" justifyContent="left">
          <Button
            variant="contained"
            color="secondary"
            children={<ArrowBackIosNew />}
            onClick={previousPlayer}
          />
          <Button
            variant="contained"
            color="secondary"
            children={<ArrowForwardIos />}
            onClick={nextPlayer}
          />
        </Box>
      )}
      {!toHealthRoll && !currentPlayerIsOnlyPlayer() && (
        <Box
          display="flex"
          justifyContent="left"
          paddingLeft={removeLifePadding(queryMatches600, isDanish)}
        >
          <Button
            variant="contained"
            color="secondary"
            children={translateRemoveHealth(isDanish)}
            onClick={() => {
              setHasClicked(true);
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
      )}
      {(toHealthRoll || currentPlayerIsOnlyPlayer()) && (
        <Box paddingTop="32.5px" />
      )}
      {toHealthRoll && (
        <Box
          display="flex"
          justifyContent="left"
          paddingLeft={rollNewLifePadding(queryMatches600, isDanish)}
        >
          <Button
            variant="contained"
            color="secondary"
            children={translateAction(isDanish, "HealthRoll")}
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
        <Box display="flex" justifyContent="left" paddingLeft="30px">
          <Button
            variant="contained"
            color="secondary"
            children={translateReset(isDanish)}
            onClick={() => {
              setCurrentHealths(
                initHealthByQuery(queryMatches600, queryMatches1200)[
                  "healthInit"
                ]
              );
              setHasHealthRolled(
                initHealthByQuery(queryMatches600, queryMatches1200)[
                  "hasHealthRolledInit"
                ]
              );
              setNumberOfPlayers(
                initHealthByQuery(queryMatches600, queryMatches1200)[
                  "numberOfPlayers"
                ]
              );
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default HealthInterractiveButtons;
