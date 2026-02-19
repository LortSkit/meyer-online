import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import StarOutlined from "@mui/icons-material/StarOutlined";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import GameLobbyName from "./GameLobbyName";
import { useGlobalContext } from "../../../contexts/Socket/SocketContext";
import { Socket } from "socket.io-client";
import { useMediaQuery } from "usehooks-ts";
import {
  translateGameId,
  translateGameOwner,
  translateHealthRoll,
  translateHealthRollCases,
  translateNeedName,
  translateNeedPlayers,
  translateShare,
  translateShareMessage,
  translateToastCopy,
  translateShareLobby,
  translateStartGame,
  translateWaiting,
  translateChangeOrder,
} from "../../../utils/lang/Game/GameLobby/langGameLobby";
import { tokens } from "../../../theme";
import GameLobbyPlayers from "./GameLobbyPlayers";
import PlayerDisplay from "../PlayerDisplay/PlayersDisplay";
import loading from "../../../assets/discordLoadingDotsDiscordLoading.gif";
import LeaveGameButton from "../LeaveGameButton";
import SetHealthRollRuleSet from "../../../components/game/SetHealthRollRuleSet";
import { useToast } from "../../../contexts/Toast/ToastContext";
import { useState } from "react";

interface Props {
  isDanish: boolean;
}

const GameLobby = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const toast = useToast();

  const { SocketState, SocketDispatch } = useGlobalContext();
  const [changingOwner, setChangingOwner] = useState(false);
  const [reordering, setReordering] = useState(false);

  const queryMatches = useMediaQuery("only screen and (min-width: 400px)");

  function thisPlayerName(): string {
    if (!SocketState.thisGame?.gamePlayers) {
      return "";
    }

    const playerIndex = SocketState.thisGame?.gamePlayers.findIndex(
      (value) => value === SocketState.uid,
    );

    return SocketState.thisGame?.gamePlayersNames[playerIndex];
  }

  function isOwner(): boolean {
    return SocketState.uid === SocketState.thisGame?.owner;
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
      {changingOwner && (
        <Box
          sx={{
            inset: 0,
            opacity: changingOwner ? 0.5 : 0,
            pointerEvents: "fill",
            position: "fixed",
            backgroundColor: changingOwner
              ? colors.grey[100]
              : colors.primary[500],
            zIndex: 1,
          }}
        />
      )}
      {reordering && (
        <Box
          sx={{
            inset: 0,
            opacity: reordering ? 0.5 : 0,
            pointerEvents: "fill",
            position: "fixed",
            backgroundColor: reordering
              ? colors.grey[100]
              : colors.primary[500],
            zIndex: 1,
          }}
        />
      )}
      <Box display="flex" justifyContent="center" flexDirection="column">
        {/* HEADING */}
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            inset: 0,
            opacity: changingOwner || reordering ? 0.5 : 1,
          }}
        >
          <GameLobbyName
            isDanish={isDanish}
            isOwner={isOwner()}
            isPublic={SocketState.thisGame?.isPublic}
            name={SocketState.thisGame?.name}
            socket={SocketState.socket as Socket}
          />
        </Box>

        {/* GAME ID */}
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            inset: 0,
            opacity: changingOwner || reordering ? 0.5 : 1,
          }}
        >
          {translateGameId(isDanish)} <Box paddingLeft="5px" />
          <strong>{SocketState.thisGame.id}</strong>
        </Box>

        {/* INVITE LINK */}
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            inset: 0,
            opacity: changingOwner || reordering ? 0.5 : 1,
          }}
        >
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
            onClick={() => {
              !queryMatches &&
                navigator.share({
                  title: translateShareMessage(isDanish),
                  text:
                    translateShareLobby(isDanish) +
                    ' "' +
                    SocketState.thisGame?.name +
                    '"',
                  url: window.location.href,
                });
              queryMatches &&
                navigator.clipboard.writeText(window.location.href);
              queryMatches && toast?.open(translateToastCopy(isDanish));
            }} //SHARING BUTTON - ONLY WORKS WITH HTTPS PROTOCOL!
            sx={{
              position: "relative",
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
            zIndex={changingOwner ? 3 : 0}
            sx={{
              inset: 0,
              opacity: reordering ? 0.5 : 1,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              sx={{ backgroundColor: colors.primary[500] }}
            >
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                paddingTop="5px"
                paddingBottom="5px"
              >
                {translateGameOwner(isDanish)}
              </Box>
              <IconButton
                disabled={SocketState.thisGame.gamePlayers.length <= 1}
                onClick={() => {
                  setChangingOwner((prev) => !prev);
                }}
                sx={{
                  position: "relative",
                }}
              >
                <StarOutlined
                  style={{
                    color:
                      SocketState.thisGame.gamePlayers.length <= 1
                        ? colors.grey[700]
                        : colors.blackAccent[100],
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* CHANGE ORDER */}
        {isOwner() && (
          <Box
            display="flex"
            justifyContent="center"
            zIndex={reordering ? 3 : 0}
            sx={{
              inset: 0,
              opacity: changingOwner ? 0.5 : 1,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              sx={{ backgroundColor: colors.primary[500] }}
            >
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                paddingTop="5px"
                paddingBottom="5px"
              >
                {translateChangeOrder(isDanish)}
              </Box>
              <IconButton
                disabled={SocketState.thisGame.gamePlayers.length <= 1}
                onClick={() => {
                  setReordering((prev) => !prev);
                }}
                sx={{
                  position: "relative",
                }}
              >
                <FormatListNumbered
                  style={{
                    color:
                      SocketState.thisGame.gamePlayers.length <= 1
                        ? colors.grey[700]
                        : colors.blackAccent[100],
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        )}

        <Box p={2} />

        {/* LEAVE GAME BUTTON */}
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          sx={{
            inset: 0,
            opacity: changingOwner || reordering ? 0.5 : 1,
          }}
        >
          <LeaveGameButton
            isDanish={isDanish}
            socket={SocketState.socket as Socket}
          />
        </Box>
        <Box p={2} />

        {/* HEALTH RULE SET */}
        {isOwner() && (
          <Box display="flex" justifyContent="center" flexBasis="100%">
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              maxWidth="360px"
              sx={{
                inset: 0,
                opacity: changingOwner || reordering ? 0.5 : 1,
              }}
            >
              <SetHealthRollRuleSet
                isDanish={isDanish}
                chosenRuleSet={SocketState.thisGame?.healthRollRuleSet}
                setChosenRuleSet={(selectedRuleSet: number) => {
                  if (
                    selectedRuleSet !== SocketState.thisGame?.healthRollRuleSet
                  ) {
                    SocketState.socket?.emit(
                      "change_healthroll_rule_set",
                      selectedRuleSet,
                    );
                  }
                }}
              />
            </Box>
          </Box>
        )}
        {!isOwner() && (
          <Box display="flex" justifyContent="center">
            {translateHealthRoll(isDanish)}
            {": "}
            {translateHealthRollCases(
              isDanish,
              SocketState.thisGame?.healthRollRuleSet,
            )}
          </Box>
        )}

        {/* NUMBER OF PLAYERS */}
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          sx={{
            inset: 0,
            opacity: changingOwner || reordering ? 0.5 : 1,
          }}
        >
          <GameLobbyPlayers
            isDanish={isDanish}
            isOwner={isOwner()}
            numberOfPlayers={SocketState.thisGame?.gamePlayers.length}
            maxNumberOfPlayers={SocketState.thisGame?.maxNumberOfPlayers}
            socket={SocketState.socket as Socket}
            changingOwner={changingOwner}
          />
        </Box>

        <Box paddingBottom="5px" />

        {/* PLAYERS */}
        <Box display="flex" justifyContent="center" zIndex={3}>
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
              currentName={(uid: string) => thisPlayerName()}
              changingOwner={changingOwner}
              setChangingOwner={setChangingOwner}
              reordering={reordering}
              setReordering={setReordering}
            />
          </Box>
        </Box>

        <Box p={1} />
        {/* NEED AT LEAST TWO PLAYERS */}
        {isMissingPlayers() && (
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              inset: 0,
              opacity: changingOwner || reordering ? 0.5 : 1,
            }}
          >
            {translateNeedPlayers(isDanish)}
          </Box>
        )}

        {/* PLAYERS HAVE TO HAVE A NAME */}
        {isMissingNames() && (
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              inset: 0,
              opacity: changingOwner || reordering ? 0.5 : 1,
            }}
          >
            {translateNeedName(isDanish)}
            <Box display="flex" justifyContent="center" flexDirection="column">
              <img src={loading} width="35px" style={{ paddingLeft: "5px" }} />
            </Box>
          </Box>
        )}

        {/* START GAME */}
        {isOwner() && (
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              inset: 0,
              opacity: changingOwner || reordering ? 0.5 : 1,
            }}
          >
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
