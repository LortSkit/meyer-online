import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeHeading from "./HomeHeading";
import { Game, useGlobalContext } from "../../contexts/Socket/SocketContext";

interface Props {
  isDanish: boolean;
}

const Home = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { SocketState, SocketDispatch } = useGlobalContext();

  function onClick() {
    let game: Game = {
      id: "",
      name: "LOBBYNAME",
      numberOfPlayers: 1,
      maxNumberOfPlayers: 10,
    };
    SocketState.socket?.emit("create_game", SocketState.uid, game);
  }

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <HomeHeading isDanish={isDanish} />

      <Button variant="contained" color="secondary" onClick={onClick}>
        <Typography fontSize="20px" children={"Create public game"} />
      </Button>
    </Box>
  );
};

export default Home;
