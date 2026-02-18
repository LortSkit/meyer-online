import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validate as isValidUUID } from "uuid";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import { base } from "../../utils/hostSubDirectory";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import {
  translateChooseName,
  translateGameDoesNotExist,
  translateGameInProgress,
  translateNotEnoughSpace,
  translatePleaseWait,
} from "../../utils/lang/Game/langGame";
import SetPlayerName from "./GameLobby/SetPlayerName";
import LeaveGameButton from "./LeaveGameButton";
import GameLobby from "./GameLobby/GameLobby";
import { Socket } from "socket.io-client";
import GameMeyer from "./GameMeyer";
import ReloadButton from "./ReloadButton";
import Typography from "@mui/material/Typography";

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
  const [hasEmitted, setHasEmitted] = useState(false);
  const [gameExists, setGameExists] = useState(false);
  const [inProgressOnJoin, setInProgressOnJoin] = useState(true);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const [chosenPlayerName, setChosenPlayerName] = useState(
    localStorage.getItem("playerName") === null
      ? ""
      : String(localStorage.getItem("playerName")),
  );

  function thisPlayerName(): string {
    if (!SocketState.thisGame?.gamePlayers) {
      return "";
    }

    const playerIndex = SocketState.thisGame?.gamePlayers.findIndex(
      (value) => value === SocketState.uid,
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

  const NotEmittedMessage = () => {
    return (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        <Typography
          display="flex"
          justifyContent="center"
          style={{
            wordBreak: "break-word",
            textAlign: "center",
          }}
          children={baseMessage(translatePleaseWait(isDanish))}
        />
        <ReloadButton isDanish={isDanish} />
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

  function joinGame() {
    SocketState.socket?.emit(
      "join_game",
      gameId,
      chosenPlayerName,
      (
        exists: boolean,
        inProgress: boolean,
        enoughSpace: boolean,
        givenPlayerName: string,
      ) => {
        setHasEmitted(true);
        setGameExists(exists);
        setInProgressOnJoin(inProgress);
        setHasEnoughSpace(enoughSpace);
        if (givenPlayerName !== "") {
          localStorage.setItem("playerName", givenPlayerName);
        }
      },
    );
  }

  useEffect(() => {
    if (!isValidUUID(gameId) && gameId !== "unknown") {
      navigate(base + "/game/unknown");
    } else {
      joinGame();
    }
  }, []);

  useEffect(() => {
    joinGame();
  }, [SocketState.socket?.id]);

  let middleChild: JSX.Element;

  if (gameId === "unknown") {
    middleChild = <StandardErrorMessage />;
  } else if (SocketState.thisGame === null) {
    middleChild = <StandardErrorMessage />;
  } else if (!hasEmitted) {
    middleChild = <NotEmittedMessage />;
  } else if (!gameExists) {
    middleChild = <StandardErrorMessage />;
  } else if (inProgressOnJoin) {
    return <GameInProgressMessage />;
  } else if (!hasEnoughSpace) {
    middleChild = <NotEnoughSpaceMessage />;
  } else if (thisPlayerName() === "") {
    middleChild = (
      <MiddleChild widthPercentage={100}>
        <Box p={4} />
        <Box display="flex" justifyContent="center">
          {translateChooseName(isDanish)}
        </Box>
        <Box display="flex" justifyContent="center">
          <SetPlayerName
            isDanish={isDanish}
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
        {!SocketState.thisGame.isInProgress &&
          SocketState.thisGame.owner !== undefined && (
            <GameLobby isDanish={isDanish} />
          )}
        {SocketState.thisGame.isInProgress && <GameMeyer isDanish={isDanish} />}
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
