import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import { base } from "../../utils/hostSubDirectory";
import { Box } from "@mui/material";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import {
  translateChooseName,
  translateGameDoesNotExist,
  translateGameInProgress,
  translateNotEnoughSpace,
} from "../../utils/lang/Game/GameLobby/langGameLobby";
import SetPlayerName from "./GameLobby/SetPlayerName";
import LeaveGameButton from "./LeaveGameButton";
import GameLobby from "./GameLobby/GameLobby";
import { Socket } from "socket.io-client";
import GameMeyer from "./GameMeyer";

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

const Game = ({ isDanish }: Props) => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [gameExists, setGameExists] = useState(false);
  const [inProgressOnJoin, setInProgressOnJoin] = useState(true);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const [chosenPlayerName, setChosenPlayerName] = useState("");

  function thisPlayerName(): string {
    if (!SocketState.thisGame?.gamePlayers) {
      return "";
    }

    const playerIndex = SocketState.thisGame?.gamePlayers.findIndex(
      (value) => value === SocketState.uid
    );

    return SocketState.thisGame?.gamePlayersNames[playerIndex];
  }
  const StandardErrorMessage = () => {
    return (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        {baseMessage(translateGameDoesNotExist(isDanish))}
        <LeaveGameButton isDanish={isDanish} socket={SocketState.socket} />
      </MiddleChild>
    );
  };

  const NotEnoughSpaceMessage = () => {
    return (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        {baseMessage(translateNotEnoughSpace(isDanish))}
        <LeaveGameButton isDanish={isDanish} socket={SocketState.socket} />
      </MiddleChild>
    );
  };

  const GameInProgressMessage = () => {
    return (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        {baseMessage(translateGameInProgress(isDanish))}
        <LeaveGameButton isDanish={isDanish} socket={SocketState.socket} />
      </MiddleChild>
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
        (exists: boolean, inProgress: boolean, enoughSpace: boolean) => {
          setGameExists(exists);
          setInProgressOnJoin(inProgress);
          setHasEnoughSpace(enoughSpace);
        }
      );
    }
  }, []);

  let middleChild: JSX.Element;

  if (gameId === "unknown") {
    middleChild = <StandardErrorMessage />;
  } else if (!gameExists) {
    middleChild = <StandardErrorMessage />;
  } else if (inProgressOnJoin) {
    return <GameInProgressMessage />;
  } else if (!hasEnoughSpace) {
    middleChild = <NotEnoughSpaceMessage />;
  } else if (SocketState.thisGame === null) {
    middleChild = <StandardErrorMessage />;
  } else if (thisPlayerName() === "") {
    middleChild = (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        <Box display="flex" justifyContent="center">
          {translateChooseName(isDanish)}
        </Box>
        <Box display="flex" justifyContent="center">
          <SetPlayerName
            chosenPlayerName={chosenPlayerName}
            socket={SocketState.socket as Socket}
            setChosenPlayerName={setChosenPlayerName}
          />
        </Box>
      </MiddleChild>
    );
  } else {
    middleChild = (
      <MiddleChild widthPercentage={100}>
        {!SocketState.thisGame.isInProgress && (
          <GameLobby isDanish={isDanish} SocketState={SocketState} />
        )}
        {SocketState.thisGame.isInProgress && (
          <GameMeyer
            isDanish={isDanish}
            gameInfo={SocketState.thisGame}
            meyerInfo={SocketState.meyerInfo}
            socket={SocketState.socket as Socket}
            uid={SocketState.uid}
          />
        )}
      </MiddleChild>
    );
  }

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={0}
      rightWidthPercentage={0}
    />
  );
};

export default Game;
