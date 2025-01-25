import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import { base } from "../../utils/hostSubDirectory";

const StandardErrorMessage = () => {
  return <div>Game does not exist!</div>;
};

const NotEnoughSpaceMessage = () => {
  return <div>This game is full!</div>;
};

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [gameExists, setGameExists] = useState(false);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);

  useEffect(() => {
    if (!isValidUUID(gameId) && gameId !== "unknown") {
      navigate(base + "/game/unknown");
    } else {
      SocketState.socket?.emit(
        "join_game",
        SocketState.uid,
        gameId,
        (exists: boolean, enoughSpace: boolean) => {
          setGameExists(exists);
          setHasEnoughSpace(enoughSpace);
        }
      );
    }
  }, []);

  if (gameId === "unknown") {
    return <StandardErrorMessage />;
  } else if (!gameExists) {
    return <StandardErrorMessage />;
  } else if (!hasEnoughSpace) {
    return <NotEnoughSpaceMessage />;
  }

  return <div>GameLobby {gameId ? gameId : ""}</div>;
};

export default GameLobby;
