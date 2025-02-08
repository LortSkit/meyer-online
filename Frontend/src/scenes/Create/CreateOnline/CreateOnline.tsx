import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  GameRequest,
  useGlobalContext,
} from "../../../contexts/Socket/SocketContext";
import SetNumberOfPlayers from "../../../components/SetNumberOfPlayers";
import { MiddleChild } from "../../../components/CenteredPage/PageChildren";
import CenteredPage from "../../../components/CenteredPage/CenteredPage";
import { useNavigate } from "react-router-dom";
import { base } from "../../../utils/hostSubDirectory";
import {
  translateCreatePrivate,
  translateCreatePublic,
  translateLobbyName,
  translateMaxNumberOfPlayers,
} from "../../../utils/lang/Create/CreateOnline/langCreateOnline";
import SetLobbyName from "./SetLobbyName";

interface Props {
  isDanish: boolean;
}

const CreateOnline = ({ isDanish }: Props) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(20);
  const [lobbyName, setLobbyName] = useState("");

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_create");
    }
  }, [SocketState.uid]);

  useEffect(() => {
    if (numberOfPlayers === 0) {
      setNumberOfPlayers(20);
    }
  }, [numberOfPlayers]);

  const navigate = useNavigate();

  function onClickPublic(): void {
    let game: GameRequest = {
      name: lobbyName,
      maxNumberOfPlayers: numberOfPlayers,
    };
    SocketState.socket?.emit("create_game", game, true, (gameId: string) => {
      navigate(`${base}/game/${gameId}`);
    });
  }

  function onClickPrivate(): void {
    let game: GameRequest = {
      name: lobbyName,
      maxNumberOfPlayers: numberOfPlayers,
    };
    SocketState.socket?.emit("create_game", game, false, (gameId: string) => {
      navigate(`${base}/game/${gameId}`);
    });
  }

  const middleChild = (
    <MiddleChild widthPercentage={90}>
      <Box p={2} />
      <Box display="flex" justifyContent="center">
        <Typography
          fontSize="16px"
          children={translateMaxNumberOfPlayers(isDanish)}
        />
        <SetNumberOfPlayers setNumberOfPlayers={setNumberOfPlayers} />
      </Box>
      <Box p={2} />
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <Typography
              fontSize="16px"
              children={translateLobbyName(isDanish)}
            />
          </Box>
          <SetLobbyName setLobbyName={setLobbyName} />
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" flexDirection="column">
        <Box paddingTop="4px" />

        {/* PUBLIC */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={onClickPublic}
            disabled={
              numberOfPlayers < 2 ||
              numberOfPlayers > 20 ||
              lobbyName.length === 0
            }
          >
            <Typography
              fontSize="20px"
              children={translateCreatePublic(isDanish)}
            />
          </Button>
        </Box>
        <Box paddingTop="4px" />

        {/* PRIVATE */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={onClickPrivate}
            disabled={
              numberOfPlayers < 2 ||
              numberOfPlayers > 20 ||
              lobbyName.length === 0
            }
          >
            <Typography
              fontSize="20px"
              children={translateCreatePrivate(isDanish)}
            />
          </Button>
        </Box>
      </Box>
    </MiddleChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={5}
      rightWidthPercentage={5}
    />
  );
};

export default CreateOnline;
