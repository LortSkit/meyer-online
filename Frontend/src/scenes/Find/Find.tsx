import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import FindHeading from "./FindHeading";
import { Game, useGlobalContext } from "../../contexts/Socket/SocketContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";

interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_find", SocketState.uid);
    }
  }, [SocketState.uid]);

  function onClick(gameId: string): () => void {
    return () => navigate(`/game/${gameId}`);
  }

  const middleChild = (
    <MiddleChild>
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center" flexDirection="column">
          <p>
            Your userId: <strong>{SocketState.uid}</strong>
          </p>
          <p>
            Users online:
            <strong>{SocketState.usersTotal}</strong>
          </p>
          <p>
            Your socketId:
            <strong>{SocketState.socket?.id}</strong>
          </p>
        </Box>
      </Box>
      {SocketState.games.map((game) => (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          flexBasis="100%"
        >
          <Box display="flex" justifyContent="center">
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
          </Box>
          <Box paddingTop="5px" />
        </Box>
      ))}
    </MiddleChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={5}
      middleWidthPercentage={90}
      rightWidthPercentage={5}
    />
  );
};

export default Find;
