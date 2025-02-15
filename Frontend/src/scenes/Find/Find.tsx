import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
  translateHealthRoll,
  translateHealthRollCases,
  translateNoFiltered,
  translateNoGames,
  translatePlayers,
  translateShowingFiltered,
  translateUsersOnline,
} from "../../utils/lang/Find/langFind";

interface Props {
  isDanish: boolean;
  searchLobbyName: string;
  setSearchLobbyName: React.Dispatch<React.SetStateAction<string>>;
}

const Find = ({ isDanish, searchLobbyName, setSearchLobbyName }: Props) => {
  const navigate = useNavigate();

  const { SocketState, SocketDispatch } = useGlobalContext();

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
            style={{ width: "335px", wordBreak: "break-all" }}
            key={game.id}
          >
            <Box>
              <Typography
                variant="h4"
                fontStyle="normal"
                textTransform="none"
                children={<strong>{game.name}</strong>}
              />
              <Typography
                fontSize="16px"
                fontStyle="normal"
                textTransform="none"
                children={
                  <>
                    {translatePlayers(isDanish)}
                    <strong>
                      {game.numberOfPlayers}/{game.maxNumberOfPlayers}
                    </strong>
                    <br />
                  </>
                }
              />
              <Typography
                fontSize="14px"
                fontStyle="normal"
                textTransform="none"
                children={
                  <>
                    {translateHealthRoll(isDanish) + ": "}
                    <strong>
                      {translateHealthRollCases(
                        isDanish,
                        game.healthRollRuleSet
                      )}
                    </strong>
                    <br />
                  </>
                }
              />
              <Typography
                fontSize="12px"
                fontStyle="normal"
                textTransform="none"
                children={
                  <>
                    {translateGameId(isDanish)}
                    <strong>{game.id}</strong>
                  </>
                }
              />
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

  useEffect(() => {
    setFilteredResults(showFilteredItems(getFilter()));
  }, [searchLobbyName, SocketState, isDanish]);

  const middleChild = (
    <MiddleChild widthPercentage={90}>
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
          searchLobbyName={searchLobbyName}
          width="315px"
          setSearchLobbyName={setSearchLobbyName}
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
          {searchLobbyName.length > 0 && filteredResults.length > 0 && (
            <Box display="flex" justifyContent="center">
              {translateShowingFiltered(isDanish)}
            </Box>
          )}
          {searchLobbyName.length > 0 && filteredResults.length <= 0 && (
            <Box display="flex" justifyContent="center">
              {translateNoFiltered(isDanish)}
            </Box>
          )}
          {filteredResults}
        </Box>
      )}
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

export default Find;
