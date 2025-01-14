import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import FindHeading from "./FindHeading";
import { useContext } from "react";
import SocketContext, {
  SocketContextProvider,
  useGlobalContext,
} from "../../contexts/Socket/SocketContext";
import SocketContextComponent from "../../contexts/Socket/Components";

interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const value = useGlobalContext();

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />
      <Box>
        Your userId: <strong>{value.SocketState.uid}</strong> <br />
        Users online: <strong>{value.SocketState.users.length}</strong> <br />
        SocketID: <strong>{value.SocketState.socket?.id}</strong> <br />
      </Box>
    </Box>
  );
};

export default Find;
