import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";

const StandardErrorMessage = () => {
  return <div>Game does not exist!</div>;
};

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [gameExists, setGameExists] = useState(false);

  useEffect(() => {
    if (!isValidUUID(gameId) && gameId !== "unknown") {
      navigate("/game/unknown");
    } else {
      SocketState.socket?.emit("join_game", gameId, (exists: boolean) => {
        setGameExists(exists);
      });
    }
  }, []);

  if (gameId === "unknown") {
    return <StandardErrorMessage />;
  } else if (!gameExists) {
    return <StandardErrorMessage />;
  }

  return <div>GameLobby {gameId ? gameId : ""}</div>;
};

export default GameLobby;
