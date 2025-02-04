import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { base } from "../../utils/hostSubDirectory";
import { translateLeave } from "../../utils/lang/Game/langLeaveGameButton";

interface Props {
  isDanish: boolean;
}

const LeaveGameButton = ({ isDanish }: Props) => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(base + "/find")}
      >
        {translateLeave(isDanish)}
      </Button>
    </Box>
  );
};

export default LeaveGameButton;
