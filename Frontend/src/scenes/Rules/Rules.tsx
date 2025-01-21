import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import RulesHeading from "./RulesHeading";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import PossibleRoles from "./PossibleRoles/PossibleRoles";
import RulesIntro from "./RulesIntro";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const middleChild = (
    <MiddleChild>
      <RulesHeading isDanish={isDanish} />
      <RulesIntro isDanish={isDanish} />
      <PossibleRoles isDanish={isDanish} />
    </MiddleChild>
  );

  return <CenteredPage middleChild={middleChild} />;
};

export default Rules;
