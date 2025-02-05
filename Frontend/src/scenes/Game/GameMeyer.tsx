import { Box, Typography, useTheme } from "@mui/material";
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

interface Props {
  isDanish: boolean;
  gameInfo: GameInfo;
  meyerInfo: MeyerInfo;
  socket: Socket;
  uid: string;
}

const GameMeyer = ({ isDanish, gameInfo, meyerInfo, socket, uid }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [truePlayerNames, setTruePlayerNames] = useState(
    gameInfo.gamePlayersNames.map(numberAfterName)
  );

  function numberAfterName(name: string, index: number): string {
    if (index === 0) {
      return gameInfo.gamePlayersNames
        .slice(1, gameInfo.gamePlayersNames.length)
        .includes(name)
        ? name + " (1)"
        : "哈哈哈哈哈好哈哈哈哈哈哈 (10)";
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

      return name + " (20)";
    }
  }

  function playernameFromUid(uid: string): string {
    const playerIndex = gameInfo.gamePlayers.findIndex(
      (value) => value === uid
    );
    return truePlayerNames[playerIndex];
  }

  function isOwner(): boolean {
    return uid === gameInfo.gamePlayers[0];
  }

  useEffect(() => {
    setTruePlayerNames(gameInfo.gamePlayersNames.map(numberAfterName));
  }, [gameInfo.gamePlayersNames]);

  const mainWidth = 67;

  const middleChild = (
    <MiddleChild widthPercentage={mainWidth}>
      <Box display="flex" justifyContent="center">
        <GameHeading
          isDanish={isDanish}
          currentPlayer={playernameFromUid(meyerInfo.currentPlayer)}
          round={meyerInfo.round}
          turn={meyerInfo.round}
        />
      </Box>
      {meyerInfo.currentPlayer === uid && (
        <Box display="flex" justifyContent="center">
          {meyerInfo.roll !== -1 && (
            <Typography
              fontSize="25px"
              fontStyle="normal"
              textTransform="none"
              component="span"
            >
              <RollWithName
                isDanish={isDanish}
                roll={meyerInfo.roll}
                color={colors.blueAccent[100]}
                sideLength={30}
              />
            </Typography>
          )}
          {meyerInfo.bluffChoices.length === 0 && (
            <Box display="flex" justifyContent="center">
              {meyerInfo.actionChoices.map((action) => (
                <ActionButton
                  isDanish={isDanish}
                  action={action}
                  onClick={() => {}}
                />
              ))}
            </Box>
          )}
          {meyerInfo.bluffChoices.length !== 0 && (
            <Box display="flex" justifyContent="center">
              {meyerInfo.bluffChoices.map((bluff) => (
                <BluffButton
                  isDanish={isDanish}
                  bluff={bluff}
                  onClick={() => {}}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </MiddleChild>
  );

  const rightChild = (
    <RightChild widthPercentage={100 - mainWidth}>
      <Box paddingTop="5px" />
      <Box display="flex" justifyContent="center">
        <PlayerDisplay
          currentName={playernameFromUid(meyerInfo.currentPlayer)}
          currentUid={meyerInfo.currentPlayer}
          healths={meyerInfo.healths}
          inProgress={gameInfo.isInProgress}
          isOwner={isOwner()}
          isGameOver={meyerInfo.isGameOver}
          playerNames={truePlayerNames}
          playerUids={gameInfo.gamePlayers}
          socket={socket}
        />
      </Box>
    </RightChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      rightChild={rightChild}
      leftWidthPercentage={0}
    />
  );
};

export default GameMeyer;
