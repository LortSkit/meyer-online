import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import InputBase from "@mui/material/InputBase";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Edit from "@mui/icons-material/Edit";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import StarOutlined from "@mui/icons-material/StarOutlined";
import { tokens } from "../../theme";
import { Dice } from "../../utils/diceUtils";
import loading from "../../assets/discordLoadingDotsDiscordLoading.gif";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  currentName: string;
  currentUid: string;
  healths?: number[];
  inProgress?: boolean;
  isOwner: boolean;
  isGameOver?: boolean;
  playerNames: string[];
  playersTimedOut: string[];
  playerUids: string[];
  socket: Socket;
  thisUid: string;
}

const PlayerDisplay = ({
  currentName,
  currentUid,
  healths,
  inProgress,
  isOwner,
  isGameOver,
  playerNames,
  playersTimedOut,
  playerUids,
  socket,
  thisUid,
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

  const ConfirmButton = () => {
    return (
      <IconButton
        onClick={onConfirm}
        style={{
          position: "relative",
          transform: "translate(0%,5%)",
          width: "20px",
          height: "20px",
        }}
      >
        <DoneOutlined sx={{ width: "18px", height: "18px" }} />
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

  const Star = () => {
    return (
      <StarOutlined
        style={{
          position: "relative",
          transform: "translate(0%,-5%)",
          width: "20px",
          height: "20px",
        }}
      />
    );
  };

  function onBlur() {
    setToggleEditName(false);
    setNameChanger(currentName);
  }

  function onEdit(): void {
    setNameChanger(currentName);
    setToggleEditName(true);
  }

  function onConfirm(): void {
    socket.emit(
      "change_player_name",
      nameChanger,
      (givenPlayerName: string) => {
        if (givenPlayerName !== "") {
          localStorage.setItem("playerName", givenPlayerName);
        }
      }
    );
    onBlur();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNameChanger(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 12);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onConfirm();
    } else if (event.key === "Escape") {
      onBlur();
    }
  }

  useEffect(() => {
    if (toggleEditName) {
      const input = document.getElementById(
        "player-name-bar" + playerUids.findIndex((uid) => uid === thisUid)
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
        onBlur={() => setTimeout(onBlur, 100)}
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
            {((healths && (healths[index] > 0 || isOwner)) || !healths) && (
              <Box display="flex">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Dice
                    eyes={healths ? healths[index] : 6}
                    color={colors.blueAccent[100]}
                    sideLength={25}
                  />
                </Box>
                <Box marginRight="3px" />
              </Box>
            )}

            {/* NAME */}
            {((healths && (healths[index] > 0 || isOwner)) || !healths) && (
              <Box
                display="flex"
                //flexDirection="column"
                justifyContent="center"
                height="24px"
                onDoubleClick={() => {
                  if (playerUids[index] === thisUid && !inProgress) onEdit();
                }}
              >
                <Typography
                  fontSize={!queryMatches && inProgress ? "10px" : "14px"}
                  style={{
                    wordBreak: "break-all",
                    textAlign: "center",
                  }}
                  color={
                    playersTimedOut.includes(playerUids[index])
                      ? colors.grey[500]
                      : undefined
                  }
                  component="span"
                  children={
                    <Box>
                      {(!toggleEditName || playerUids[index] !== thisUid) && (
                        <>
                          {name !== "" && name}
                          {name === "" && (
                            <img
                              src={loading}
                              width="35px"
                              style={{ paddingLeft: "5px" }}
                            />
                          )}
                          {numberAfterName(name, index)}
                          {playerUids[index] === thisUid &&
                            !inProgress &&
                            EditNameButton()}
                        </>
                      )}
                      {toggleEditName &&
                        !inProgress &&
                        playerUids[index] === thisUid &&
                        InputNameElement(index)}
                      {isOwner &&
                        playerUids[index] !== thisUid &&
                        KickPlayerButton(playerUids[index])}
                      {!isOwner && index === 0 && Star()}
                    </Box>
                  }
                />
                {toggleEditName &&
                  !inProgress &&
                  playerUids[index] === thisUid &&
                  ConfirmButton()}
              </Box>
            )}
          </Box>
          <Box paddingTop="5px" />
        </Box>
      ))}
      <Box paddingBottom="2px" />
    </Box>
  );
};

export default PlayerDisplay;
