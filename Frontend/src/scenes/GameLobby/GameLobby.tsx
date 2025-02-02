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
  translateNeedName,
  translateNeedPlayers,
  translateNotEnoughSpace,
  translateShare,
  translateStartGame,
  translateWaiting,
} from "../../utils/lang/GameLobby/langGameLobby";
import PlayersHealthsDisplay from "../../components/game/PlayersHealthsDisplay";
import SetPlayerName from "./SetPlayerName";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import { tokens } from "../../theme";
import GameLobbyName from "./GameLobbyName";
import { Socket } from "socket.io-client";
import GameLobbyPlayers from "./GameLobbyPlayers";

function baseMessage(message: string) {
  return (
    <MiddleChild widthPercentage={90}>
      <Box display="flex" justifyContent="center">
        {message}
      </Box>
    </MiddleChild>
  );
}

function initHealths(numberOfPlayers: number): number[] {
  let result = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    result.push(6);
  }
  return result;
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
      //TODO: Implement this event on the socket side!
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
    middleChild = <StandardErrorMessage />;
  } else if (!gameExists || SocketState.thisGame?.gamePlayers.length === 0) {
    middleChild = <StandardErrorMessage />;
  } else if (!hasEnoughSpace) {
    middleChild = <NotEnoughSpaceMessage />;
  } else if (thisPlayerName() === "") {
    middleChild = (
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center">
          {translateChooseName(isDanish)}
        </Box>
        <SetPlayerName
          value={chosenPlayerName}
          setChosenPlayerName={setChosenPlayerName}
          onKeyDown={onKeyDown}
        />
      </Box>
    );
  } else {
    middleChild = (
      <MiddleChild widthPercentage={90}>
        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="center" flexDirection="column">
            {/* HEADING */}
            <GameLobbyName
              isOwner={isOwner()}
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
                  position: "fixed",
                  transform: "translate(150%,-16%)",
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
                    position: "fixed",
                    transform: `translate(${isDanish ? 270 : 380}%,-10%)`,
                  }}
                />
              </Box>
            )}
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
            <Box display="flex" justifyContent="center" paddingRight="70px">
              <PlayersHealthsDisplay
                currentHealths={initHealths(
                  SocketState.thisGame?.gamePlayersNames.length
                )}
                playerNames={SocketState.thisGame?.gamePlayersNames}
              />
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
                  justifyContent="center"
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
