import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  translateShow,
  translateTurnInformation,
  translateTurnInformationText1,
  translateTurnInformationText2,
} from "../../utils/lang/Rules/langRulesTurnInformation";
import { isAction, TurnInfo, TurnInfoType } from "../../utils/gameTypes";
import { useEffect, useState } from "react";
import TurnInformation from "../../components/game/TurnInformation/TurnInformation";
import { getDiceRoll, getMeyerRoll } from "../../utils/diceUtils";

interface Props {
  isDanish: boolean;
  currentPlayer: number;
  currentRoll: number;
  previousPlayer: number;
  previousRoll: number;
}

const RulesTurnInformation = ({
  isDanish,
  currentPlayer,
  currentRoll,
  previousPlayer,
  previousRoll,
}: Props) => {
  const [turnInformation, setTurnInformation] = useState([] as TurnInfo[]);
  const [round, setRound] = useState(1);

  const possibleTurnInfoType = [
    "Check",
    "Continue",
    "HealthRoll",
    "Roll",
    "Cheers",
    "SameRollOrHigher",
    "Truth",
    "CheckTT",
    "CheckFT",
    "CheckTF",
    "CheckFF",
    "CheckLoseHealth",
  ] as TurnInfoType[];

  function TurnInfoTypeToTurnInfo(value: TurnInfoType): TurnInfo {
    if (!isAction(value)) {
      if (value === ("CheckLoseHealth" as TurnInfoType)) {
        let losingPlayer = currentPlayer;
        let healthToLose = previousRoll === 21 ? 2 : 1;
        return [value, [losingPlayer, healthToLose]];
      }

      return [value, [previousPlayer, previousRoll, getMeyerRoll()]];
    } else {
      let resultingNumberList = [currentPlayer];

      if (!["Check", "HealthRoll", "Truth", "Bluff"].includes(value)) {
        return [value, resultingNumberList];
      }
      switch (value) {
        case "Check":
          resultingNumberList.push(previousPlayer);
          break;

        case "HealthRoll":
          resultingNumberList.push(getDiceRoll());
          break;

        case "Truth":
          let roll = currentRoll;
          resultingNumberList.push(roll);
          break;

        case "Bluff":
          let bluff = currentRoll;
          resultingNumberList.push(bluff);
          break;
      }

      return [value, resultingNumberList];
    }
  }

  function getPossibleTurnInfo() {
    return possibleTurnInfoType.map((value) => TurnInfoTypeToTurnInfo(value));
  }

  useEffect(() => {}, [
    currentPlayer,
    currentRoll,
    previousPlayer,
    previousRoll,
  ]);

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
        children={<strong>{translateTurnInformation(isDanish)}</strong>}
      />
      <Typography
        fontSize="18px"
        fontStyle="normal"
        textTransform="none"
        children={
          <>
            {translateTurnInformationText1(isDanish)}
            <br />
            <br />
            {translateTurnInformationText2(isDanish)}
          </>
        }
      />
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setTurnInformation(getPossibleTurnInfo());
          }}
          disabled={turnInformation.length >= 1}
          children={translateShow(isDanish)}
        />
      </Box>
      <TurnInformation
        isDanish={isDanish}
        round={round}
        showTimer
        setTurnInformation={setTurnInformation}
        turnInformation={turnInformation}
      />
    </Box>
  );
};

export default RulesTurnInformation;
