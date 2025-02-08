import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { Action } from "../../utils/gameTypes";
import { translateAction } from "../../utils/lang/components/game/langActionChoices";

interface Props {
  isDanish: boolean;
  action: Action;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const ActionButton = ({ isDanish, action, onClick }: Props) => {
  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      <Typography
        fontSize="20px"
        fontStyle="normal"
        textTransform="none"
        children={translateAction(isDanish, action)}
      />
    </Button>
  );
};

export default ActionButton;
