import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import StarOutlined from "@mui/icons-material/StarOutlined";
import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import GameLobbyName from "./GameLobbyName";
import { ISocketContextState } from "../../../contexts/Socket/SocketContext";
import { Socket } from "socket.io-client";
import {
  translateGameId,
  translateGameOwner,
  translateHealthRoll,
  translateHealthRollCases,
  translateNeedName,
  translateNeedPlayers,
  translateShare,
  translateStartGame,
  translateWaiting,
} from "../../../utils/lang/Game/GameLobby/langGameLobby";
import { tokens } from "../../../theme";
import GameLobbyPlayers from "./GameLobbyPlayers";
import PlayerDisplay from "../PlayersDisplay";
import loading from "../../../assets/discordLoadingDotsDiscordLoading.gif";
import LeaveGameButton from "../LeaveGameButton";
import SetHealthRollRuleSet from "../../../components/game/SetHealthRollRuleSet";

interface Props {
  isDanish: boolean;
  SocketState: ISocketContextState;
}

const GameLobby = ({ isDanish, SocketState }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  return (
    <Box display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" flexDirection="column">
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
          <strong>{SocketState.thisGame.id}</strong>
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
            onClick={() => navigator.clipboard.writeText(window.location.href)} //SHARING BUTTON - ONLY WORKS WITH HTTPS PROTOCOL!
            sx={{
              position: "relative",
            }}
          >
            <IosShareOutlined style={{ color: colors.blackAccent[100] }} />
          </IconButton>
        </Box>

        {/* YOU ARE GAME OWNER - (if you are) */}
        {isOwner() && (
          <Box display="flex" justifyContent="center">
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
        <LeaveGameButton
          isDanish={isDanish}
          socket={SocketState.socket as Socket}
        />
        <Box p={2} />

        {/* HEALTH RULE SET */}
        {isOwner() && (
          <SetHealthRollRuleSet
            isDanish={isDanish}
            chosenRuleSet={SocketState.thisGame.healthRollRuleSet}
            setChosenRuleSet={(selectedRuleSet: number) => {
              if (selectedRuleSet !== SocketState.thisGame.healthRollRuleSet) {
                SocketState.socket?.emit(
                  "change_healthroll_rule_set",
                  selectedRuleSet
                );
              }
            }}
          />
        )}
        {!isOwner() && (
          <Box display="flex" justifyContent="center">
            {translateHealthRoll(isDanish)}
            {": "}
            {translateHealthRollCases(
              isDanish,
              SocketState.thisGame?.healthRollRuleSet
            )}
          </Box>
        )}

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
            paddingLeft="55px"
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
              playersTimedOut={SocketState.thisGame.gamePlayersTimeout}
              playerUids={SocketState.thisGame.gamePlayers}
              socket={SocketState.socket as Socket}
              thisUid={SocketState.uid}
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
            <Box display="flex" justifyContent="center" flexDirection="column">
              <img src={loading} width="35px" style={{ paddingLeft: "5px" }} />
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
              onClick={() => SocketState.socket?.emit("start_game")}
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
  );
};

export default GameLobby;
