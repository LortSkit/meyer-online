import RulesHeading from "./RulesHeading";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import PossibleRolls from "./PossibleRolls/PossibleRolls";
import RulesHowToPlay from "./RulesHowToPlay/RulesHowToPlay";
import { useMediaQuery } from "usehooks-ts";
import RulesHealth from "./RulesHealth/RulesHealth";
import RulesTurnInformation from "./RulesTurnInformation";
import { useState } from "react";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const queryMatches = useMediaQuery("only screen and (min-width: 1200px)");
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentRoll, setCurrentRoll] = useState(43);
  const [previousPlayer, setPreviousPlayer] = useState(-1);
  const [previousRoll, setPreviousRoll] = useState(-1);

  function doCheck(queryMatches: boolean) {
    if (queryMatches) {
      return [12.5, 75];
    } else {
      return [5, 90];
    }
  }

  const middleChild = (
    <MiddleChild>
      <RulesHeading isDanish={isDanish} />
      <br />
      <PossibleRolls isDanish={isDanish} />
      <br />
      <RulesHowToPlay
        isDanish={isDanish}
        currentRoll={currentRoll}
        previousRoll={previousRoll}
        setCurrentRoll={setCurrentRoll}
        setPreviousRoll={setPreviousRoll}
      />
      <br />
      <RulesHealth
        isDanish={isDanish}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        setPreviousPlayer={setPreviousPlayer}
      />
      <br />
      <RulesTurnInformation
        isDanish={isDanish}
        currentPlayer={currentPlayer}
        currentRoll={currentRoll}
        previousPlayer={previousPlayer}
        previousRoll={previousRoll}
      />
    </MiddleChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={doCheck(queryMatches)[0]}
      middleWidthPercentage={doCheck(queryMatches)[1]}
      rightWidthPercentage={doCheck(queryMatches)[0]}
    />
  );
};

export default Rules;
