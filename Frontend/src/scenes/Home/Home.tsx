import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeHeading from "./HomeHeading";
import HomeText from "./HomeText";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const middleChild = (
    <MiddleChild>
      {/* HEADING */}
      <HomeHeading isDanish={isDanish} />
      <HomeText isDanish={isDanish} />
    </MiddleChild>
  );

  return <CenteredPage middleChild={middleChild} />;
};

export default Home;
