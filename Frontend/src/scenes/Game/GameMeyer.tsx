import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import Timer from "@mui/icons-material/Timer";
import TimerOff from "@mui/icons-material/TimerOff";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { GameInfo, MeyerInfo } from "../../contexts/Socket/SocketContext";
import GameHeading from "../../components/game/GameHeading";
import { useEffect, useState } from "react";
import {
  MiddleChild,
  RightChild,
} from "../../components/CenteredPage/PageChildren";
import PlayerDisplay from "./PlayersDisplay";
import { Socket } from "socket.io-client";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { RollWithName } from "../../utils/diceUtils";
import { tokens } from "../../theme";
import ActionButton from "../../components/game/ActionButton";
import BluffButton from "../../components/game/BluffButton";
import GameOverHeading from "../../components/game/GameOverHeading";
import {
  translateBack,
  translatePlayAgain,
  translateReopen,
  translateToggle,
  translateWaiting,
} from "../../utils/lang/Game/langGameMeyer";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import TurnInformation from "../../components/game/TurnInformation/TurnInformation";
import { TurnInfo } from "../../utils/gameTypes";
import LeaveGameButton from "./LeaveGameButton";

interface Props {
  isDanish: boolean;
  gameInfo: GameInfo | null;
  meyerInfo: MeyerInfo | null;
  socket: Socket;
  uid: string;
}

const GameMeyer = ({ isDanish, gameInfo, meyerInfo, socket, uid }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [truePlayerNames, setTruePlayerNames] = useState(
    gameInfo !== null ? gameInfo.gamePlayersNames.map(numberAfterName) : []
  );
  const [rightToggle, setRightToggle] = useState(
    localStorage.getItem("rightSide") !== undefined
      ? localStorage.getItem("rightSide") === "true"
      : true
  );
  const [showTimer, setShowTimer] = useState(
    localStorage.getItem("showTimer") !== undefined
      ? localStorage.getItem("showTimer") === "true"
      : true
  );

  function numberAfterName(name: string, index: number): string {
    if (gameInfo === null || meyerInfo === null) {
      return "";
    }
    if (index === 0) {
      return gameInfo.gamePlayersNames
        .slice(1, gameInfo.gamePlayersNames.length)
        .includes(name)
        ? name + " (1)"
        : name;
    } else {
      const previousNames = gameInfo.gamePlayersNames.slice(0, index);
      if (previousNames.includes(name)) {
        let i = 0;
        previousNames.forEach((value) => {
          if (value === name) {
            i++;
          }
        });

        return name + " (" + (i + 1) + ")";
      } else if (
        gameInfo.gamePlayersNames
          .slice(index + 1, gameInfo.gamePlayersNames.length)
          .includes(name)
      ) {
        return name + " (1)";
      }

      return name;
    }
  }

  function playernameFromUid(uid: string): string {
    if (gameInfo === null || meyerInfo === null) {
      return "";
    }
    const playerIndex = gameInfo.gamePlayers.findIndex(
      (value) => value === uid
    );
    return truePlayerNames[playerIndex];
  }

  function isOwner(): boolean {
    if (gameInfo === null || meyerInfo === null) {
      return false;
    }
    return uid === gameInfo.gamePlayers[0];
  }

  const toggleTimerButton = () => {
    return (
      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() =>
            setShowTimer((st) => {
              localStorage.setItem("showTimer", String(!st));
              return !st;
            })
          }
        >
          {showTimer && <Timer />}
          {!showTimer && <TimerOff />}
        </IconButton>
      </Box>
    );
  };

  useEffect(() => {
    if (gameInfo !== null) {
      setTruePlayerNames(gameInfo.gamePlayersNames.map(numberAfterName));
    }
  }, [gameInfo]);

  useEffect(() => {
    if (truePlayerNames.includes("")) {
      if (gameInfo === null || gameInfo.gamePlayersNames.includes("")) {
        setTimeout(function () {
          window.location.reload();
        });
      } else {
        setTruePlayerNames(gameInfo.gamePlayersNames.map(numberAfterName));
      }
    }
  }, [truePlayerNames]);

  const mainWidth = 62;

  const middleChild = (
    <MiddleChild widthPercentage={mainWidth}>
      <Box display="flex" justifyContent="center">
        <Typography
          variant="h1"
          fontStyle="normal"
          textTransform="none"
          paddingTop="9.5px"
          style={{
            wordBreak: "break-all",
            textAlign: "center",
          }}
          children={<strong>{gameInfo !== null ? gameInfo.name : ""}</strong>}
        />
      </Box>
      <Box display="flex" justifyContent="center" paddingBottom="10.8px">
        <LeaveGameButton isDanish={isDanish} socket={socket} />
      </Box>
      {/* IN GAME */}
      {!meyerInfo?.isGameOver && (
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <GameHeading
              isDanish={isDanish}
              currentPlayer={playernameFromUid(
                meyerInfo !== null ? meyerInfo.currentPlayer : ""
              )}
              round={meyerInfo !== null ? meyerInfo.round : 0}
              turn={meyerInfo !== null ? meyerInfo.turn : 0}
            />
          </Box>
          {/* CURRENT PLAYER DISPLAY */}
          {meyerInfo?.currentPlayer === uid && (
            <Box display="flex" flexDirection="column">
              {meyerInfo.roll !== -1 && (
                <Typography
                  fontSize="25px"
                  fontStyle="normal"
                  textTransform="none"
                  component="span"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <RollWithName
                    isDanish={isDanish}
                    roll={meyerInfo.roll}
                    color={colors.blueAccent[100]}
                    sideLength={30}
                  />
                </Typography>
              )}
              {/* ACTION */}
              {meyerInfo.bluffChoices.length === 0 && (
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                  {meyerInfo.actionChoices.map((action) => (
                    <Box display="flex" justifyContent="center" key={action}>
                      <ActionButton
                        isDanish={isDanish}
                        action={action}
                        onClick={() => {
                          socket.emit("take_action_bluff", action, -1);
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
              {/* BLUFF */}
              {meyerInfo.bluffChoices.length !== 0 && (
                <Box display="flex" flexDirection="column">
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        socket.emit("take_action_bluff", "Error", -1);
                      }}
                    >
                      <ArrowBackIosNew />
                      {translateBack(isDanish)}
                    </Button>
                  </Box>
                  <Box paddingTop="5px" />
                  <Box display="flex" justifyContent="center" flexWrap="wrap">
                    {meyerInfo.bluffChoices.map((bluff) => (
                      <Box display="flex" justifyContent="center" key={bluff}>
                        <BluffButton
                          isDanish={isDanish}
                          bluff={bluff}
                          onClick={() => {
                            socket.emit("take_action_bluff", "Error", bluff);
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          {/* NOT CURRENT PLAYER DISPLAY */}
          {meyerInfo?.currentPlayer !== uid && (
            <Typography
              fontSize="12px"
              fontStyle="normal"
              textTransform="none"
              component="span"
              style={{
                wordBreak: "break-word",
                textAlign: "center",
              }}
              sx={{ display: "flex", justifyContent: "center" }}
              children={
                <Box>
                  {translateWaiting(
                    isDanish,
                    playernameFromUid(
                      meyerInfo !== null ? meyerInfo.currentPlayer : ""
                    )
                  )}
                  <img
                    src={loading}
                    width="35px"
                    style={{ paddingLeft: "5px" }}
                  />
                </Box>
              }
            />
          )}
          {toggleTimerButton()}
        </Box>
      )}
      {/* GAME OVER */}
      {meyerInfo?.isGameOver && (
        <Box display="flex" flexDirection="column">
          <GameOverHeading
            isDanish={isDanish}
            currentPlayer={playernameFromUid(meyerInfo.currentPlayer)}
            round={meyerInfo.round + 1}
            turnsTotal={meyerInfo.turnTotal + 1}
          />
          {isOwner() && (
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  socket.emit("restart_game");
                }}
                disabled={
                  gameInfo !== null ? gameInfo.gamePlayers.length < 2 : false
                }
              >
                {translatePlayAgain(isDanish)}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  socket.emit("reopen_lobby");
                }}
              >
                {translateReopen(isDanish)}
              </Button>
            </Box>
          )}
        </Box>
      )}
      <TurnInformation
        isDanish={isDanish}
        playerNames={gameInfo !== null ? gameInfo.gamePlayersNames : []}
        round={meyerInfo !== null ? meyerInfo.round : 0}
        showTimer={showTimer}
        setTurnInformation={function (update: TurnInfo[]) {}}
        turnInformation={meyerInfo !== null ? meyerInfo.turnInformation : []}
      />
    </MiddleChild>
  );

  const sideChild = (
    <RightChild widthPercentage={100 - mainWidth}>
      <Box display="flex" justifyContent="center" p={1}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setRightToggle((rt) => {
              localStorage.setItem("rightSide", String(!rt));
              return !rt;
            })
          }
        >
          {translateToggle(isDanish, rightToggle)}
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ outline: "4px solid", outlineColor: colors.primary[600] }}
      >
        <Box display="flex" justifyContent="left">
          <PlayerDisplay
            currentName={playernameFromUid(
              meyerInfo !== null ? meyerInfo.currentPlayer : ""
            )}
            currentUid={meyerInfo !== null ? meyerInfo.currentPlayer : ""}
            healths={meyerInfo !== null ? meyerInfo.healths : []}
            inProgress={gameInfo !== null ? gameInfo.isInProgress : false}
            isOwner={isOwner()}
            isGameOver={meyerInfo !== null ? meyerInfo.isGameOver : false}
            playerNames={truePlayerNames}
            playersTimedOut={
              gameInfo !== null ? gameInfo.gamePlayersTimeout : []
            }
            playerUids={gameInfo !== null ? gameInfo.gamePlayers : []}
            socket={socket}
            thisUid={uid}
          />
        </Box>
      </Box>
    </RightChild>
  );

  return (
    <CenteredPage
      leftChild={!rightToggle ? sideChild : undefined}
      rightWidthPercentage={!rightToggle ? 0 : undefined}
      middleChild={middleChild}
      rightChild={rightToggle ? sideChild : undefined}
      leftWidthPercentage={rightToggle ? 0 : undefined}
    />
  );
};

export default GameMeyer;
