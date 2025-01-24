import { Box, Typography } from "@mui/material";
import { translateHealthHeading } from "../../utils/lang/Rules/langRulesHealth";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { RightChild } from "../../components/CenteredPage/PageChildren";
import PlayersHealthsDisplay from "../../components/game/PlayersHealthsDisplay";
import { useState } from "react";

interface Props {
  isDanish: boolean;
}

const RulesHealth = ({ isDanish }: Props) => {
  let currentHealthsInit = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6];
  const [currentHealths, setCurrentHealths] = useState(currentHealthsInit);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const rightChild = (
    <RightChild widthPercentage={50}>
      <PlayersHealthsDisplay
        isDanish={isDanish}
        currentHealths={currentHealths}
        currentPlayer={currentPlayer}
      />
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
        leftWidthPercentage={0}
        middleWidthPercentage={0}
        rightChild={rightChild}
      />
    </Box>
  );
};

export default RulesHealth;
