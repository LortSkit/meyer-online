import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import { base } from "../../utils/hostSubDirectory";
import { Box, IconButton, Typography } from "@mui/material";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { IosShareOutlined, StarOutlined } from "@mui/icons-material";
import {
  translateGameId,
  translateGameOwner,
  translateShare,
} from "../../utils/lang/GameLobby/langGameLobby";

function baseMessage(message: string) {
  return (
    <MiddleChild widthPercentage={90}>
      <Box display="flex" justifyContent="center">
        {message}
      </Box>
    </MiddleChild>
  );
}

const StandardErrorMessage = () => {
  return baseMessage("Game does not exist!");
};

const NotEnoughSpaceMessage = () => {
  return baseMessage("This game is full!");
};

interface Props {
  isDanish: boolean;
}

const GameLobby = ({ isDanish }: Props) => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [gameExists, setGameExists] = useState(false);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const [lobbyName, setLobbyName] = useState("");

  useEffect(() => {
    if (!isValidUUID(gameId) && gameId !== "unknown") {
      navigate(base + "/game/unknown");
    } else {
      SocketState.socket?.emit(
        "join_game",
        SocketState.uid,
        gameId,
        (exists: boolean, enoughSpace: boolean, gameName: string) => {
          setGameExists(exists);
          setHasEnoughSpace(enoughSpace);
          setLobbyName(gameName);
        }
      );
    }
  }, []);

  let middleChild: JSX.Element;

  if (gameId === "unknown") {
    middleChild = <StandardErrorMessage />;
  } else if (!gameExists) {
    middleChild = <StandardErrorMessage />;
  } else if (!hasEnoughSpace) {
    middleChild = <NotEnoughSpaceMessage />;
  } else {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Typography
              variant="h1"
              fontStyle="normal"
              textTransform="none"
              sx={{ display: "flex", justifyContent: "center" }}
              children={<strong>{lobbyName}</strong>}
            />
            <Box display="flex" justifyContent="center">
              {translateGameId(isDanish)} <Box paddingLeft="5px" />
              <strong>{gameId}</strong>
            </Box>
            <Box display="flex" justifyContent="center">
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                {translateShare(isDanish)}
              </Box>
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                } //SHARING BUTTON - ONLY WORKS WITH HTTPS PROTOCOL!
              >
                <IosShareOutlined />
              </IconButton>
            </Box>
            {SocketState.uid === SocketState.gamePlayers[0] && (
              <Box
                display="flex"
                justifyContent="center"
                onMouseEnter={undefined}
              >
                {translateGameOwner(isDanish)}
                <StarOutlined />
              </Box>
            )}
            <Box p={5} />
            {SocketState.gamePlayers.map((player: string) => (
              <Box key={player}>{player}</Box>
            ))}
          </Box>
        </Box>
      </MiddleChild>
    );
  }

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={5}
      rightWidthPercentage={5}
    />
  );
};

export default GameLobby;
