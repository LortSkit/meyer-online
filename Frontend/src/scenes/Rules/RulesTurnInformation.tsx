import { Box, Typography } from "@mui/material";
import { translateTurnInformation } from "../../utils/lang/Rules/langRulesTurnInformation";
import { isAction, TurnInfo, TurnInfoType } from "../../utils/gameTypes";
import { useState } from "react";
import TurnInformation from "../../components/game/TurnInformation/TurnInformation";

interface Props {
  isDanish: boolean;
}

const RulesTurnInformation = ({ isDanish }: Props) => {
  const [turnInformation, setTurnInformation] = useState([] as TurnInfo[]);
  const [round, setRound] = useState(1);

  // const possibleTurnInfo = [
  //   "Check",
  //   "HealthRoll",
  //   "Roll",
  //   "Cheers",
  //   "SameRollOrHigher",
  //   "Truth",
  //   "Bluff",
  //   "CheckTT",
  //   "CheckFT",
  //   "CheckTF",
  //   "CheckFF",
  //   "CheckLoseHealth",
  // ] as TurnInfoType[];

  // function TurnInfoTypeToTurnInfo(value: TurnInfoType): TurnInfo {
  //   if (!isAction(value)) {
  //     if (value === ("CheckLoseHealth" as TurnInfoType)) {
  //       return [value, [losingPlayer, healthToLose]]
  //     }

  //     return [previousPlayer, previousDeclaredRoll, previousRoll]
  //   } else {
  //     let resultingNumberList = [currentPlayer];

  //     if (!["Check", "HealthRoll", "Truth", "Bluff"].includes(value)) {
  //       return [value, resultingNumberList];
  //     }
  //     switch (value) {
  //       case "Check":
  //         resultingNumberList.push(previousPlayer);
  //         break;

  //       case "HealthRoll":
  //         resultingNumberList.push(healthRoll);
  //         break;

  //       case "Truth":
  //         resultingNumberList.push(roll);
  //         break;

  //       case "Bluff":
  //         resultingNumberList.push(bluff);
  //         break;
  //     }

  //     return [value, resultingNumberList];
  //   }
  // }

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
      <TurnInformation
        isDanish={isDanish}
        round={round}
        turnInformation={turnInformation}
        setTurnInformation={setTurnInformation}
      />
    </Box>
  );
};

export default RulesTurnInformation;
