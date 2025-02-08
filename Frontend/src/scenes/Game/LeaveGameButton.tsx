import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { base } from "../../utils/hostSubDirectory";
import { translateLeave } from "../../utils/lang/Game/langLeaveGameButton";
import { Socket } from "socket.io-client";

interface Props {
  isDanish: boolean;
  socket: Socket | undefined;
}

const LeaveGameButton = ({ isDanish, socket }: Props) => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          socket !== undefined ? socket.emit("leave_game") : undefined;
          navigate(base + "/find");
        }}
      >
        {translateLeave(isDanish)}
      </Button>
    </Box>
  );
};

export default LeaveGameButton;
