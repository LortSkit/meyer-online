import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { Meyer } from "../../../utils/gameLogic";
import {
  translateCreateLocal,
  translateCreateNewGame,
  translateCreateOnline,
  translateCreatePrivate,
  translateCreatePublic,
} from "../../../utils/lang/Create/CreateNewGame/langCreateNewGameButton";
import {
  GameRequest,
  useGlobalContext,
} from "../../../contexts/Socket/SocketContext";
import { useNavigate } from "react-router-dom";

interface Props {
  isDanish: boolean;
  numberOfPlayers: number;
  setCanCreateNewGame: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentHealths: React.Dispatch<React.SetStateAction<number[]>>;
  setInGame: React.Dispatch<React.SetStateAction<boolean>>;
  setMeyer: React.Dispatch<React.SetStateAction<Meyer>>;
}

const CreateNewGameButtons = ({
  isDanish,
  numberOfPlayers,
  setCanCreateNewGame,
  setCurrentHealths,
  setInGame,
  setMeyer,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { SocketState, SocketDispatch } = useGlobalContext();
  const navigate = useNavigate();

  function onClickLocal(): void {
    setCanCreateNewGame(false);
    let meyerInstance = new Meyer(numberOfPlayers);
    setMeyer(meyerInstance);
    setInGame(true);
    setCurrentHealths(meyerInstance.getCurrentHealths());
  }

  function onClickPublic(): void {
    let game: GameRequest = {
      name: "LOBBYNAME",
      maxNumberOfPlayers: numberOfPlayers,
    };
    SocketState.socket?.emit(
      "create_game",
      SocketState.uid,
      game,
      true,
      (gameId: string) => {
        navigate(`/game/${gameId}`);
      }
    );
  }

  function onClickPrivate(): void {
    let game: GameRequest = {
      name: "LOBBYNAME",
      maxNumberOfPlayers: numberOfPlayers,
    };
    SocketState.socket?.emit(
      "create_game",
      SocketState.uid,
      game,
      false,
      (gameId: string) => {
        navigate(`/game/${gameId}`);
      }
    );
  }
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      {/* LOCAL */}
      <Box display="flex" justifyContent="center">
        <Typography
          fontSize="16px"
          fontStyle="normal"
          textTransform="none"
          children={translateCreateLocal(isDanish)}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickLocal}
          disabled={numberOfPlayers < 2 || numberOfPlayers > 10}
        >
          <Typography
            fontSize="20px"
            children={translateCreateNewGame(isDanish)}
          />
        </Button>
      </Box>
      <Box paddingTop="20px" />

      {/* ONLINE */}
      <Box display="flex" justifyContent="center">
        <Typography
          fontSize="16px"
          fontStyle="normal"
          textTransform="none"
          children={translateCreateOnline(isDanish)}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Box paddingTop="4px" />

        {/* PUBLIC */}
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickPublic}
          disabled={numberOfPlayers < 2 || numberOfPlayers > 10}
        >
          <Typography
            fontSize="20px"
            children={translateCreatePublic(isDanish)}
          />
        </Button>
        <Box marginLeft="4px" />

        {/* PRIVATE */}
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickPrivate}
          disabled={numberOfPlayers < 2 || numberOfPlayers > 10}
        >
          <Typography
            fontSize="20px"
            children={translateCreatePrivate(isDanish)}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default CreateNewGameButtons;
