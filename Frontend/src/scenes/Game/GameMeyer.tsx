import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import useTheme from "@mui/material/styles/useTheme";
import Timer from "@mui/icons-material/Timer";
import TimerOff from "@mui/icons-material/TimerOff";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";
import GameHeading from "../../components/game/GameHeading";
import { useEffect, useState } from "react";
import {
  MiddleChild,
  RightChild,
} from "../../components/CenteredPage/PageChildren";
import PlayerDisplay from "./PlayersDisplay";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { RollWithName } from "../../utils/diceUtils";
import { tokens } from "../../theme";
import ActionButton from "../../components/game/ActionButton";
import BluffButton from "../../components/game/BluffButton";
import GameOverHeading from "../../components/game/GameOverHeading";
import {
  translateBack,
  translateHealthRoll,
  translateHealthRollCases,
  translatePlayAgain,
  translateReopen,
  translateToggle,
  translateWaitingOwner,
  translateWaitingTurn,
} from "../../utils/lang/Game/langGameMeyer";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import TurnInformation from "../../components/game/TurnInformation/TurnInformation";
import { TurnInfo } from "../../utils/gameTypes";
import LeaveGameButton from "./LeaveGameButton";
import SetHealthRollRuleSet from "../../components/game/SetHealthRollRuleSet";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  isDanish: boolean;
}

const GameMeyer = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { SocketState, SocketDispatch } = useGlobalContext();

  const queryMatches = useMediaQuery("only screen and (min-width: 400px)");

  function isGameOverMobile(): boolean {
    if (!queryMatches && SocketState.meyerInfo.isGameOver) {
      return true;
    }

    return false;
  }

  const mainWidthGameOverMobile = 95;

  const [truePlayerNames, setTruePlayerNames] = useState(
    SocketState.thisGame.gamePlayersNames.map(numberAfterName),
  );
  const [rightToggle, setRightToggle] = useState(
    localStorage.getItem("rightSide") !== undefined
      ? localStorage.getItem("rightSide") === "true"
      : true,
  );
  const [showTimer, setShowTimer] = useState(
    localStorage.getItem("showTimer") !== undefined
      ? localStorage.getItem("showTimer") === "true"
      : true,
  );

  function numberAfterName(name: string, index: number): string {
    if (SocketState.thisGame === null || SocketState.meyerInfo === null) {
      return "";
    }
    if (index === 0) {
      return SocketState.thisGame.gamePlayersNames
        .slice(1, SocketState.thisGame.gamePlayersNames.length)
        .includes(name)
        ? name + " (1)"
        : name;
    } else {
      const previousNames = SocketState.thisGame.gamePlayersNames.slice(
        0,
        index,
      );
      if (previousNames.includes(name)) {
        let i = 0;
        previousNames.forEach((value) => {
          if (value === name) {
            i++;
          }
        });

        return name + " (" + (i + 1) + ")";
      } else if (
        SocketState.thisGame.gamePlayersNames
          .slice(index + 1, SocketState.thisGame.gamePlayersNames.length)
          .includes(name)
      ) {
        return name + " (1)";
      }

      return name;
    }
  }

  function playernameFromUid(uid: string): string {
    if (SocketState.thisGame === null || SocketState.meyerInfo === null) {
      return "";
    }
    const playerIndex = SocketState.thisGame.gamePlayers.findIndex(
      (value) => value === uid,
    );
    return truePlayerNames[playerIndex];
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
    if (SocketState.thisGame !== null) {
      setTruePlayerNames(
        SocketState.thisGame.gamePlayersNames.map(numberAfterName),
      );
    }
  }, [SocketState.thisGame]);

  useEffect(() => {
    if (truePlayerNames.includes("")) {
      if (
        SocketState.thisGame === null ||
        SocketState.thisGame.gamePlayersNames.includes("")
      ) {
        setTimeout(function () {
          window.location.reload();
        });
      } else {
        setTruePlayerNames(
          SocketState.thisGame.gamePlayersNames.map(numberAfterName),
        );
      }
    }
  }, [truePlayerNames]);

  const mainWidth = 62;

  const middleChild = (
    <MiddleChild
      widthPercentage={isGameOverMobile() ? mainWidthGameOverMobile : mainWidth}
    >
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
          children={
            <strong>
              {SocketState.thisGame !== null ? SocketState.thisGame.name : ""}
            </strong>
          }
        />
      </Box>
      <Box display="flex" justifyContent="center" paddingBottom="10.8px">
        <LeaveGameButton isDanish={isDanish} socket={SocketState.socket} />
      </Box>
      {/* IN GAME */}
      {!SocketState.meyerInfo?.isGameOver && (
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center">
            <GameHeading
              isDanish={isDanish}
              currentPlayer={playernameFromUid(
                SocketState.meyerInfo !== null
                  ? SocketState.meyerInfo.currentPlayer
                  : "",
              )}
              round={SocketState.meyerInfo.round}
              turn={SocketState.meyerInfo.turn}
            />
          </Box>
          {/* CURRENT PLAYER DISPLAY */}
          {SocketState.meyerInfo?.currentPlayer === SocketState.uid && (
            <Box display="flex" flexDirection="column">
              {SocketState.meyerInfo.roll !== -1 && (
                <Typography
                  fontSize="25px"
                  fontStyle="normal"
                  textTransform="none"
                  component="span"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <RollWithName
                    isDanish={isDanish}
                    roll={SocketState.meyerInfo.roll}
                    color={colors.blueAccent[100]}
                    sideLength={30}
                  />
                </Typography>
              )}
              {/* ACTION */}
              {SocketState.meyerInfo.bluffChoices.length === 0 && (
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                  {SocketState.meyerInfo.actionChoices.map((action) => (
                    <Box display="flex" justifyContent="center" key={action}>
                      <ActionButton
                        isDanish={isDanish}
                        action={action}
                        onClick={() => {
                          SocketState.socket?.emit(
                            "take_action_bluff",
                            action,
                            -1,
                          );
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
              {/* BLUFF */}
              {SocketState.meyerInfo.bluffChoices.length !== 0 && (
                <Box display="flex" flexDirection="column">
                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        SocketState.socket?.emit(
                          "take_action_bluff",
                          "Error",
                          -1,
                        );
                      }}
                    >
                      <ArrowBackIosNew />
                      {translateBack(isDanish)}
                    </Button>
                  </Box>
                  <Box paddingTop="5px" />
                  <Box display="flex" justifyContent="center" flexWrap="wrap">
                    {SocketState.meyerInfo.bluffChoices.map((bluff) => (
                      <Box display="flex" justifyContent="center" key={bluff}>
                        <BluffButton
                          isDanish={isDanish}
                          bluff={bluff}
                          onClick={() => {
                            SocketState.socket?.emit(
                              "take_action_bluff",
                              "Error",
                              bluff,
                            );
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
          {SocketState.meyerInfo?.currentPlayer !== SocketState.uid && (
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
                  {translateWaitingTurn(
                    isDanish,
                    playernameFromUid(SocketState.meyerInfo.currentPlayer),
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
      {SocketState.meyerInfo.isGameOver && (
        <Box display="flex" flexDirection="column" overflow="hidden">
          <GameOverHeading
            isDanish={isDanish}
            currentPlayer={playernameFromUid(
              SocketState.meyerInfo.currentPlayer,
            )}
            round={SocketState.meyerInfo.round + 1}
            turnsTotal={SocketState.meyerInfo.turnTotal + 1}
          />
          {SocketState.thisGame.owner === SocketState.uid && (
            <Box display="flex" justifyContent="center">
              <SetHealthRollRuleSet
                isDanish={isDanish}
                chosenRuleSet={SocketState.thisGame.healthRollRuleSet}
                setChosenRuleSet={(selectedRuleSet: number) => {
                  if (
                    selectedRuleSet !== SocketState.thisGame.healthRollRuleSet
                  ) {
                    SocketState.socket?.emit(
                      "change_healthroll_rule_set",
                      selectedRuleSet,
                    );
                  }
                }}
              />
            </Box>
          )}
          {SocketState.thisGame?.owner === SocketState.uid && (
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  SocketState.socket?.emit("restart_game");
                }}
                disabled={SocketState.thisGame.gamePlayers.length < 2}
              >
                {translatePlayAgain(isDanish)}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  SocketState.socket?.emit("reopen_lobby");
                }}
              >
                {translateReopen(isDanish)}
              </Button>
            </Box>
          )}
          {SocketState.thisGame.owner !== SocketState.uid && (
            <Box display="flex" flexDirection="column">
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
                    {translateWaitingOwner(
                      isDanish,
                      SocketState.thisGame.gamePlayersNames[0],
                    )}
                    <img
                      src={loading}
                      width="35px"
                      style={{ paddingLeft: "5px" }}
                    />
                  </Box>
                }
              />
              <Box paddingTop="5px" />
              <Box display="flex" justifyContent="center">
                {translateHealthRoll(isDanish)}
                {": "}
                {translateHealthRollCases(
                  isDanish,
                  SocketState.thisGame.healthRollRuleSet,
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Box display="flex" justifyContent="center">
        <Box
          flexBasis={`${
            !queryMatches && showTimer ? mainWidth + 20 : mainWidth + 40
          }%`}
        >
          <TurnInformation
            isDanish={isDanish}
            playerNames={SocketState.thisGame.gamePlayersNames}
            round={SocketState.meyerInfo.round}
            showTimer={showTimer}
            setTurnInformation={function (update: TurnInfo[]) {}}
            turnInformation={SocketState.meyerInfo.turnInformation}
          />
        </Box>
      </Box>
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
            currentName={playernameFromUid}
            changingOwner={false}
            setChangingOwner={() => {}}
          />
        </Box>
      </Box>
    </RightChild>
  );

  return (
    <CenteredPage
      leftChild={
        isGameOverMobile() ? undefined : !rightToggle ? sideChild : undefined
      }
      rightWidthPercentage={
        isGameOverMobile() ? 2.5 : !rightToggle ? 0 : undefined
      }
      middleChild={middleChild}
      rightChild={
        isGameOverMobile() ? undefined : rightToggle ? sideChild : undefined
      }
      leftWidthPercentage={
        isGameOverMobile() ? 2.5 : rightToggle ? 0 : undefined
      }
    />
  );
};

export default GameMeyer;
