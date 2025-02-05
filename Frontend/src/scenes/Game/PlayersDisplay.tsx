import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { ArrowForwardOutlined, CloseOutlined, Edit } from "@mui/icons-material";
import { Dice } from "../../utils/diceUtils";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  currentName: string;
  currentUid: string;
  healths?: number[];
  inProgress?: boolean;
  isOwner: boolean;
  isGameOver?: boolean;
  playerNames: string[];
  playerUids: string[];
  socket: Socket;
}

const PlayerDisplay = ({
  currentName,
  currentUid,
  healths,
  inProgress,
  isOwner,
  isGameOver,
  playerNames,
  playerUids,
  socket,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const queryMatches = useMediaQuery("only screen and (min-width: 790px)");

  const [toggleEditName, setToggleEditName] = useState(false);
  const [nameChanger, setNameChanger] = useState(currentName);

  function numberAfterName(name: string, index: number): string {
    if (index === 0) {
      return playerNames.slice(1, playerNames.length).includes(name)
        ? " (1)"
        : "";
    } else {
      const previousNames = playerNames.slice(0, index);
      if (previousNames.includes(name)) {
        let i = 0;
        previousNames.forEach((value) => {
          if (value === name) {
            i++;
          }
        });

        return " (" + (i + 1) + ")";
      } else if (
        playerNames.slice(index + 1, playerNames.length).includes(name)
      ) {
        return " (1)";
      }

      return "";
    }
  }

  const EditNameButton = () => {
    return (
      <IconButton
        onClick={onEdit}
        style={{
          position: "relative",
          transform: "translate(0%,-5%)",
          width: "20px",
          height: "20px",
        }}
      >
        <Edit sx={{ width: "18px", height: "18px" }} />
      </IconButton>
    );
  };

  function onKick(uid: string) {
    return () => socket.emit("kick_player", uid);
  }

  const KickPlayerButton = (uid: string) => {
    return (
      <IconButton
        onClick={onKick(uid)}
        style={{
          position: "relative",
          width: "20px",
          height: "20px",
        }}
      >
        <CloseOutlined sx={{ width: "18px", height: "18px" }} />
      </IconButton>
    );
  };

  function onBlur() {
    setToggleEditName(false);
    setNameChanger(currentName);
  }

  function onEdit(): void {
    setToggleEditName(true);
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNameChanger(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 12);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      socket.emit("change_player_name", nameChanger);
      onBlur();
    } else if (event.key === "Escape") {
      onBlur();
    }
  }

  useEffect(() => {
    setNameChanger(currentName);
  }, [currentName]);

  useEffect(() => {
    if (toggleEditName) {
      const input = document.getElementById(
        "player-name-bar" + playerUids.findIndex((uid) => uid === currentUid)
      ) as HTMLInputElement;
      input?.focus();
      input?.setSelectionRange(input?.value.length, input?.value.length);
    }
  }, [toggleEditName]);

  const InputNameElement = (index: number) => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        bgcolor={colors.primary[600]}
        borderRadius="3px"
        paddingTop="1px"
        onBlur={onBlur}
      >
        <InputBase
          id={"player-name-bar" + index}
          sx={{
            color: colors.blackAccent[100],
            height: "25px",
            fontSize: "16px",
            paddingBottom: "3px",
          }}
          type="text"
          required={true}
          inputProps={{
            maxLength: 12,
          }}
          fullWidth
          inputMode="text"
          value={nameChanger}
          onChange={onChange}
          onInput={onInput}
          onKeyDown={onKeyDown}
        />
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" flexWrap="wrap" width="273px">
      {playerNames.map((name, index) => (
        <Box display="flex" flexDirection="column" key={index}>
          <Box display="flex">
            {/* ARROW - (if wanted) */}
            {isGameOver !== undefined &&
              playerUids[index] === currentUid &&
              !isGameOver && (
                <Box display="flex" bgcolor={colors.primary[500]}>
                  <ArrowForwardOutlined />
                </Box>
              )}
            {isGameOver !== undefined &&
              !(playerUids[index] === currentUid && !isGameOver) && (
                <Box paddingLeft="calc(20.5px + 5px)" />
              )}
            {/* DICE ICON */}
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Dice
                eyes={healths ? healths[index] : 6}
                color={colors.blueAccent[100]}
                sideLength={25}
              />
            </Box>
            <Box marginRight="3px" />

            {/* NAME */}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height="24px"
              onDoubleClick={() => {
                if (playerUids[index] === currentUid && !inProgress) onEdit();
              }}
            >
              {name !== "" && (
                <Typography
                  fontSize={!queryMatches && inProgress ? "10px" : "14px"}
                  style={{
                    wordBreak: "break-all",
                    textAlign: "center",
                  }}
                  component="span"
                  children={
                    <Box>
                      {(!toggleEditName ||
                        playerUids[index] !== currentUid) && (
                        <>
                          {name}
                          {numberAfterName(name, index)}
                          {playerUids[index] === currentUid &&
                            !inProgress &&
                            EditNameButton()}
                        </>
                      )}
                      {toggleEditName &&
                        !inProgress &&
                        playerUids[index] === currentUid &&
                        InputNameElement(index)}
                      {isOwner &&
                        playerUids[index] !== currentUid &&
                        KickPlayerButton(playerUids[index])}
                    </Box>
                  }
                />
              )}
              {name === "" && (
                <img
                  src={loading}
                  width="35px"
                  style={{ paddingLeft: "5px" }}
                />
              )}
            </Box>
          </Box>
          <Box paddingTop="5px" />
        </Box>
      ))}
      <Box paddingBottom="2px" />
    </Box>
  );
};

export default PlayerDisplay;
