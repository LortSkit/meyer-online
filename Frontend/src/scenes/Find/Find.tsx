import { Box, Button, Typography, useTheme } from "@mui/material";
import FindHeading from "./FindHeading";
import { Game, useGlobalContext } from "../../contexts/Socket/SocketContext";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { base } from "../../utils/hostSubDirectory";
import SearchBar from "../../components/SearchBar";
import {
  translateGameId,
  translateGameName,
  translateNoFiltered,
  translateNoGames,
  translatePlayers,
  translateShowingFiltered,
  translateUsersOnline,
} from "../../utils/lang/Find/langFind";

interface Props {
  isDanish: boolean;
  searchBarRef: any;
  searchLobbyName: string;
  setSearchLobbyName: React.Dispatch<React.SetStateAction<string>>;
}

const Find = ({
  isDanish,
  searchBarRef,
  searchLobbyName,
  setSearchLobbyName,
}: Props) => {
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();

  useEffect(() => {
    if (searchBarRef.value) {
      document.getElementById("search-bar")?.focus(); //Doesn't work on ios - Made something else work okay-ish though
    }
  }, []);

  useEffect(() => {
    /* Connect to the Web Socket */
    if (SocketState.uid) {
      SocketState.socket?.emit("join_find");
    }
  }, [SocketState.uid]);

  function onClick(gameId: string): () => void {
    return () => navigate(`${base}/game/${gameId}`);
  }

  function showFilteredItems(filter?: any): ReactElement[] {
    let games = SocketState.games;
    if (filter) {
      games = games.filter(filter);
    }

    return games.map((game) => (
      <Box display="flex" flexDirection="column" key={game.id}>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={onClick(game.id)}
            disabled={game.numberOfPlayers >= game.maxNumberOfPlayers}
            key={game.id}
          >
            <Box>
              <Typography
                fontSize="12px"
                fontStyle="normal"
                textTransform="none"
                component="span"
              >
                {translateGameId(isDanish)}
                <Typography
                  fontSize="12px"
                  textTransform="uppercase"
                  component="strong"
                >
                  <strong>{game.id}</strong>
                </Typography>
                <br />

                {translateGameName(isDanish)}
                <strong>{game.name}</strong>

                <br />
                {translatePlayers(isDanish)}
                <strong>
                  {game.numberOfPlayers}/{game.maxNumberOfPlayers}
                </strong>
              </Typography>
            </Box>
          </Button>
        </Box>
        <Box paddingTop="4px" />
      </Box>
    ));
  }

  function getFilter() {
    if (searchLobbyName.length <= 0) {
      return undefined;
    }

    return (value: Game) => {
      return (
        value.name.toUpperCase().indexOf(searchLobbyName.toUpperCase()) !== -1
      );
    };
  }

  const [filteredResults, setFilteredResults] = useState(
    showFilteredItems(getFilter())
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    searchBarRef.value = event.target.value;
    setSearchLobbyName(event.target.value);
  }

  useEffect(() => {
    setFilteredResults(showFilteredItems(getFilter()));
  }, [searchLobbyName, SocketState, isDanish]);

  const middleChild = (
    <MiddleChild>
      {/* HEADING */}
      <FindHeading isDanish={isDanish} />

      {/* USERS ONLINE */}
      <Box display="flex" justifyContent="center">
        {translateUsersOnline(isDanish)}
        <Box paddingLeft="5px" />
        <strong>{SocketState.usersTotal}</strong>
      </Box>
      <Box p={2} />

      {/* SEARCH BAR */}
      <Box display="flex" justifyContent="center">
        <SearchBar
          isDanish={isDanish}
          searchBarRef={searchBarRef}
          retainValue
          width="315px"
          onChange={onChange}
        />
      </Box>
      <Box paddingTop="10px" />

      {/* WHEN NO ITEMS */}
      {SocketState.games.length === 0 && (
        <Typography
          fontSize="18px"
          fontStyle="normal"
          textTransform="none"
          sx={{ display: "flex", justifyContent: "center" }}
          children={translateNoGames(isDanish)}
        />
      )}

      {/* WHEN ITEMS */}
      {SocketState.games.length !== 0 && (
        <Box display="flex" justifyContent="center" flexDirection="column">
          {searchLobbyName.length > 0 &&
            filteredResults.length > 0 &&
            translateShowingFiltered(isDanish)}
          {searchLobbyName.length > 0 &&
            filteredResults.length <= 0 &&
            translateNoFiltered(isDanish)}
          {filteredResults}
        </Box>
      )}
    </MiddleChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={5}
      middleWidthPercentage={90}
      rightWidthPercentage={5}
    />
  );
};

export default Find;
