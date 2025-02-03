import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import { base } from "../../utils/hostSubDirectory";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { IosShareOutlined, StarOutlined } from "@mui/icons-material";
import {
  translateChooseName,
  translateGameDoesNotExist,
  translateGameId,
  translateGameOwner,
  translateLeave,
  translateNeedName,
  translateNeedPlayers,
  translateNotEnoughSpace,
  translateShare,
  translateStartGame,
  translateWaiting,
} from "../../utils/lang/GameLobby/langGameLobby";
import SetPlayerName from "./SetPlayerName";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import { tokens } from "../../theme";
import GameLobbyName from "./GameLobbyName";
import { Socket } from "socket.io-client";
import GameLobbyPlayers from "./GameLobbyPlayers";
import PlayerDisplay from "./PlayersDisplay";

function baseMessage(message: string) {
  return (
    <Box display="flex" justifyContent="center">
      {message}
    </Box>
  );
}

interface Props {
  isDanish: boolean;
}

const GameLobby = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const StandardErrorMessage = () => {
    return baseMessage(translateGameDoesNotExist(isDanish));
  };

  const NotEnoughSpaceMessage = () => {
    return baseMessage(translateNotEnoughSpace(isDanish));
  };

  const { gameId } = useParams();
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [gameExists, setGameExists] = useState(false);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const [chosenPlayerName, setChosenPlayerName] = useState("");

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      SocketState.socket?.emit("change_player_name", chosenPlayerName);
    }
  }

  function thisPlayerName(): string {
    if (!SocketState.thisGame?.gamePlayers) {
      return "";
    }

    const playerIndex = SocketState.thisGame?.gamePlayers.findIndex(
      (value) => value === SocketState.uid
    );

    return SocketState.thisGame?.gamePlayersNames[playerIndex];
  }

  function isOwner(): boolean {
    return SocketState.uid === SocketState.thisGame?.gamePlayers[0];
  }

  function isMissingPlayers(): boolean {
    return SocketState.thisGame?.gamePlayers.length < 2;
  }

  function isMissingNames(): boolean {
    return SocketState.thisGame?.gamePlayersNames.includes("");
  }

  function canStartGame(): boolean {
    if (isMissingPlayers() || isMissingNames()) {
      return false;
    }

    return true;
  }

  const LeaveGameButton = () => {
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

  useEffect(() => {
    if (!isValidUUID(gameId) && gameId !== "unknown") {
      navigate(base + "/game/unknown");
    } else {
      const chosenPlayerName =
        localStorage.getItem("playerName") === null
          ? ""
          : localStorage.getItem("playerName");

      SocketState.socket?.emit(
        "join_game",
        gameId,
        chosenPlayerName,
        (
          exists: boolean,
          enoughSpace: boolean,
          gameName: string,
          givenPlayerName: string
        ) => {
          setGameExists(exists);
          setHasEnoughSpace(enoughSpace);
        }
      );
    }
  }, []);

  let middleChild: JSX.Element;

  if (gameId === "unknown") {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box p={4} />
        <StandardErrorMessage />
        <LeaveGameButton />
      </MiddleChild>
    );
  } else if (!gameExists || SocketState.thisGame?.gamePlayers.length === 0) {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box p={4} />
        <StandardErrorMessage />
        <LeaveGameButton />
      </MiddleChild>
    );
  } else if (!hasEnoughSpace) {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box p={4} />
        <NotEnoughSpaceMessage />
        <LeaveGameButton />
      </MiddleChild>
    );
  } else if (thisPlayerName() === "") {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box p={4} />
        <Box display="flex" justifyContent="center">
          {translateChooseName(isDanish)}
        </Box>
        <Box display="flex" justifyContent="center">
          <SetPlayerName
            value={chosenPlayerName}
            setChosenPlayerName={setChosenPlayerName}
            onKeyDown={onKeyDown}
          />
        </Box>
      </MiddleChild>
    );
  } else {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            width="90%"
          >
            {/* HEADING */}
            <GameLobbyName
              isDanish={isDanish}
              isOwner={isOwner()}
              isPublic={SocketState.thisGame?.isPublic}
              name={SocketState.thisGame?.name}
              socket={SocketState.socket as Socket}
            />

            {/* GAME ID */}
            <Box display="flex" justifyContent="center">
              {translateGameId(isDanish)} <Box paddingLeft="5px" />
              <strong>{gameId}</strong>
            </Box>

            {/* INVITE LINK */}
            <Box display="flex" justifyContent="center">
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                paddingTop="5px"
                paddingBottom="5px"
              >
                {translateShare(isDanish)}
              </Box>
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                } //SHARING BUTTON - ONLY WORKS WITH HTTPS PROTOCOL!
                sx={{
                  position: "relative",
                }}
              >
                <IosShareOutlined style={{ color: colors.blackAccent[100] }} />
              </IconButton>
            </Box>

            {/* YOU ARE GAME OWNER - (if you are) */}
            {isOwner() && (
              <Box
                display="flex"
                justifyContent="center"
                onMouseEnter={undefined}
              >
                {translateGameOwner(isDanish)}
                <Box paddingLeft="5px" />
                <StarOutlined
                  sx={{
                    position: "relative",
                  }}
                />
              </Box>
            )}

            {/* LEAVE GAME BUTTON */}
            <LeaveGameButton />
            <Box p={2} />

            {/* NUMBER OF PLAYERS */}

            <GameLobbyPlayers
              isDanish={isDanish}
              isOwner={isOwner()}
              numberOfPlayers={SocketState.thisGame?.gamePlayers.length}
              maxNumberOfPlayers={SocketState.thisGame?.maxNumberOfPlayers}
              socket={SocketState.socket as Socket}
            />

            <Box paddingBottom="5px" />

            {/* PLAYERS */}
            <Box display="flex" justifyContent="center">
              <Box
                display="flex"
                justifyContent="center"
                paddingLeft="85px"
                paddingTop="10px"
                paddingBottom="3px"
                bgcolor={colors.primary[600]}
                borderRadius="50px"
              >
                <PlayerDisplay
                  currentName={thisPlayerName()}
                  currentUid={SocketState.uid}
                  isOwner={isOwner()}
                  playerNames={SocketState.thisGame.gamePlayersNames}
                  playerUids={SocketState.thisGame.gamePlayers}
                  socket={SocketState.socket as Socket}
                />
              </Box>
            </Box>

            <Box p={1} />
            {/* NEED AT LEAST TWO PLAYERS */}
            {isMissingPlayers() && (
              <Box display="flex" justifyContent="center">
                {translateNeedPlayers(isDanish)}
              </Box>
            )}

            {/* PLAYERS HAVE TO HAVE A NAME */}
            {isMissingNames() && (
              <Box display="flex" justifyContent="center">
                {translateNeedName(isDanish)}
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  flexDirection="column"
                >
                  <img
                    src={loading}
                    width="35px"
                    style={{ paddingLeft: "5px" }}
                  />
                </Box>
              </Box>
            )}

            {/* START GAME */}
            {isOwner() && (
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!canStartGame()}
                >
                  <Typography
                    fontSize="16px"
                    fontStyle="normal"
                    textTransform="none"
                    children={translateStartGame(isDanish)}
                  />
                </Button>
              </Box>
            )}
            {!isOwner() && canStartGame() && (
              <Box display="flex" justifyContent="center">
                <Typography
                  fontSize="16px"
                  fontStyle="normal"
                  textTransform="none"
                  children={translateWaiting(isDanish)}
                />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  flexDirection="column"
                >
                  <img
                    src={loading}
                    width="35px"
                    style={{ paddingLeft: "5px", paddingBottom: "5.5px" }}
                  />
                </Box>
              </Box>
            )}
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
