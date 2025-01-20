import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { RulesHook, RulesIntroduction } from "./TextSections";
import { RulesPossibleRolls } from "./PossibleRoles";
import RulesHeading from "./RulesHeading";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const Rules = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const middleChild = (
    <MiddleChild>
      <RulesHeading isDanish={isDanish} />

      {/* HOOK */}
      <RulesHook isDanish={isDanish} />

      {/* INTRODUCTION */}
      <RulesIntroduction isDanish={isDanish} />

      {/* POSSIBLE ROLLS */}
      <RulesPossibleRolls isDanish={isDanish} />
    </MiddleChild>
  );

  return <CenteredPage middleChild={middleChild} />;
};

export default Rules;
