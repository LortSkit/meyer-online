import RulesHeading from "./RulesHeading";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import PossibleRolls from "./PossibleRolls/PossibleRolls";
import RulesHowToPlay from "./RulesHowToPlay/RulesHowToPlay";
import { useMediaQuery } from "usehooks-ts";
import RulesHealth from "./RulesHealth";
import RulesTurnInformation from "./RulesTurnInformation";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const queryMatches = useMediaQuery("only screen and (min-width: 1200px)");

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
      <RulesHowToPlay isDanish={isDanish} />
      <br />
      <RulesHealth isDanish={isDanish} />
      <br />
      <RulesTurnInformation isDanish={isDanish} />
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
