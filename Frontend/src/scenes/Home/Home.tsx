import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeHeading from "./HomeHeading";
import {
  GameRequest,
  useGlobalContext,
} from "../../contexts/Socket/SocketContext";
import { useNavigate } from "react-router-dom";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();

  function onClickPublic() {
    let game: GameRequest = {
      name: "LOBBYNAME",
      maxNumberOfPlayers: 10,
    };
    SocketState.socket?.emit(
      "create_game",
      SocketState.uid,
      game,
      true,
      (gameId: string) => {
        navigate(`/game/${gameId}`);
      }
    );
  }

  function onClickPrivate() {
    let game: GameRequest = {
      name: "LOBBYNAME",
      maxNumberOfPlayers: 10,
    };
    SocketState.socket?.emit(
      "create_game",
      SocketState.uid,
      game,
      false,
      (gameId: string) => {
        navigate(`/game/${gameId}`);
      }
    );
  }

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <HomeHeading isDanish={isDanish} />

      <Button variant="contained" color="secondary" onClick={onClickPublic}>
        <Typography fontSize="20px" children={"Create public game"} />
      </Button>
      <Button variant="contained" color="secondary" onClick={onClickPrivate}>
        <Typography fontSize="20px" children={"Create private game"} />
      </Button>
    </Box>
  );
};

export default Home;
