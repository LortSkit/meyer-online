import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import FindHeading from "./FindHeading";
import { Game, useGlobalContext } from "../../contexts/Socket/SocketContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_lobby", SocketState.uid);
    }
  }, [SocketState.uid]);

  function onClick(gameId: string): () => void {
    return () => navigate(`/game/${gameId}`);
  }

  const middleChild = (
    <MiddleChild>
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />
      <Box>
        Your userId: <strong>{SocketState.uid}</strong> <br />
        Users online: <strong>{SocketState.usersTotal}</strong> <br />
        SocketID: <strong>{SocketState.socket?.id}</strong> <br />
      </Box>
      <br />
      <br />
      <Box>
        {SocketState.games.map((game) => (
          <Button
            variant="contained"
            color="secondary"
            onClick={onClick(game.id)}
            disabled={game.numberOfPlayers >= game.maxNumberOfPlayers}
            key={game.id}
          >
            <Box>
              Game Id: <strong>{game.id}</strong> <br />
              Game name: <strong>{game.name}</strong> <br />
              Players:
              <strong>
                {game.numberOfPlayers}/{game.maxNumberOfPlayers}
              </strong>
              <br />
            </Box>
          </Button>
        ))}
      </Box>
    </MiddleChild>
  );

  return <CenteredPage middleChild={middleChild} />;
};

export default Find;
