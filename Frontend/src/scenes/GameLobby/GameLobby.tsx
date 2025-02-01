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
  translateChooseName,
  translateGameDoesNotExist,
  translateGameId,
  translateGameOwner,
  translateNotEnoughSpace,
  translateShare,
} from "../../utils/lang/GameLobby/langGameLobby";
import PlayersHealthsDisplay from "../../components/game/PlayersHealthsDisplay";
import SetPlayerName from "./SetPlayerName";

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
  const [lobbyName, setLobbyName] = useState("");
  const [chosenPlayerName, setChosenPlayerName] = useState("");

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      console.log("clicked!");
      SocketState.socket?.emit("change_player_name", chosenPlayerName);
    }
  }

  function thisPlayerName(): string {
    if (!SocketState.gamePlayers) {
      return "";
    }

    const playerIndex = SocketState.gamePlayers.findIndex(
      (value) => value === SocketState.uid
    );

    return SocketState.gamePlayersNames[playerIndex];
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
          setLobbyName(gameName);
        }
      );
    }
  }, []);

  let middleChild: JSX.Element;

  if (gameId === "unknown") {
    middleChild = <StandardErrorMessage />;
  } else if (!gameExists || SocketState.gamePlayers.length === 0) {
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
                <Box paddingLeft="5px" />
                <StarOutlined />
              </Box>
            )}
            <Box p={5} />

            <Box display="flex" justifyContent="center">
              <PlayersHealthsDisplay
                currentHealths={initHealths(
                  SocketState.gamePlayersNames.length
                )}
                playerNames={SocketState.gamePlayersNames}
              />
            </Box>
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
