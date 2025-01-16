import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import FindHeading from "./FindHeading";
import { Game, useGlobalContext } from "../../contexts/Socket/SocketContext";
import { useEffect } from "react";

interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    StartListeners();
  }, []);

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_lobby", SocketState.uid);
    }
  }, [SocketState.uid]);

  const StartListeners = () => {
    SocketState.socket?.on("joined_lobby", (games: Game[]) => {
      SocketDispatch({ type: "update_games", payload: games });
    });

    SocketState.socket?.on("add_game", (game: Game) => {
      SocketDispatch({
        type: "update_game",
        payload: game,
      });
    });

    SocketState.socket?.on("remove_game", (gameId: string) => {
      SocketDispatch({
        type: "remove_game",
        payload: gameId,
      });
    });
  };

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />
      <Box>
        Your userId: <strong>{SocketState.uid}</strong> <br />
        Users online: <strong>{SocketState.users.length}</strong> <br />
        SocketID: <strong>{SocketState.socket?.id}</strong> <br />
      </Box>
      <br />
      <br />
      <Box>
        {SocketState.games.map((game) => (
          <Box key={game.id}>
            Game Id: <strong>{game.id}</strong> <br />
            Game name: <strong>{game.name}</strong> <br />
            Players:
            <strong>
              {game.numberOfPlayers}/{game.maxNumberOfPlayers}
            </strong>
            <br />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Find;
