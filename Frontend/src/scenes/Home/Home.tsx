import HomeHeading from "./HomeHeading";
import HomeText from "./HomeText";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
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
      {/* HEADING */}
      <HomeHeading isDanish={isDanish} />
      <HomeText isDanish={isDanish} />
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

export default Home;
