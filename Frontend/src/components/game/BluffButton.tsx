import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { tokens } from "../../theme";
import { RollWithName } from "../../utils/diceUtils";
import { isGreaterThanEqualTo } from "../../utils/gameLogic";

interface Props {
  isDanish: boolean;
  bluff: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const BluffButton = ({ isDanish, bluff, onClick }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const queryMatches = useMediaQuery("only screen and (min-width: 1200px)");

  function doCheck(queryMatches: boolean) {
    if (queryMatches) {
      return 20;
    } else {
      return 15;
    }
  }

  function width(isDanish: boolean, bluff: number, size: number): string {
    let result: number;
    if (bluff === 21) {
      result = size === 20 ? size * 3.2 : size * 3.7;
    } else if (bluff == 31) {
      if (isDanish) {
        result = size === 20 ? size * 6.5 : size * 7;
      } else {
        result = size === 20 ? size * 6.8 : size * 7.35;
      }
    } else if (isGreaterThanEqualTo(bluff, 11)) {
      if (isDanish) {
        result = size === 20 ? size * 4 : size * 4.55;
      } else {
        result = size === 20 ? size * 6.02 : size * 6.55;
      }
    } else {
      result = size * 3;
    }
    return `${result}px`;
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onClick}
      style={{
        width: width(isDanish, bluff, doCheck(queryMatches)),
        minWidth: 0,
      }}
    >
      <Typography
        fontSize={`${doCheck(queryMatches)}px`}
        fontStyle="normal"
        textTransform="none"
        component="span"
        children={
          <RollWithName
            isDanish={isDanish}
            roll={bluff}
            color={colors.primary[300]}
            sideLength={doCheck(queryMatches)}
          />
        }
      />
    </Button>
  );
};

export default BluffButton;
