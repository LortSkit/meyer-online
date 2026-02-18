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
import { useMediaQuery } from "usehooks-ts";
import { useGlobalContext } from "../../contexts/Socket/SocketContext";

interface Props {
  currentName: (uid: string) => string;
  changingOwner: boolean;
  setChangingOwner: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerDisplay = ({
  currentName,
  changingOwner,
  setChangingOwner,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const queryMatches = useMediaQuery("only screen and (min-width: 790px)");

  const { SocketState, SocketDispatch } = useGlobalContext();

  const [toggleEditName, setToggleEditName] = useState(false);

  const [nameChanger, setNameChanger] = useState(
    currentName(SocketState.meyerInfo?.currentPlayer),
  );

  const [hovered, setHovered] = useState("");

  function numberAfterName(name: string, index: number): string {
    if (index === 0) {
      return SocketState.thisGame?.gamePlayersNames
        .slice(1, SocketState.thisGame?.gamePlayersNames.length)
        .includes(name)
        ? " (1)"
        : "";
    } else {
      const previousNames = SocketState.thisGame?.gamePlayersNames.slice(
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

        return " (" + (i + 1) + ")";
      } else if (
        SocketState.thisGame?.gamePlayersNames
          .slice(index + 1, SocketState.thisGame?.gamePlayersNames.length)
          .includes(name)
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
    return () => SocketState.socket?.emit("kick_player", uid);
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
    SocketState.socket?.emit(
      "change_player_name",
      nameChanger,
      (givenPlayerName: string) => {
        if (givenPlayerName !== "") {
          localStorage.setItem("playerName", givenPlayerName);
        }
      },
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
        "player-name-bar" +
          SocketState.thisGame.gamePlayers.findIndex(
            (uid) => uid === SocketState.uid,
          ),
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
      {SocketState.thisGame.gamePlayersNames.map((name, index) => (
        <Box
          display="flex"
          flexDirection="column"
          key={index}
          onMouseEnter={() =>
            setHovered(SocketState.thisGame.gamePlayers[index])
          }
          onMouseLeave={() => {
            setHovered("");
          }}
          onClick={() => {
            if (SocketState.thisGame.gamePlayers[index] !== SocketState.uid) {
              setChangingOwner(false);
              SocketState.socket?.emit(
                "change_owner",
                SocketState.thisGame.gamePlayers[index],
              );
            }
          }}
        >
          <Box display="flex">
            {/* ARROW - (if wanted) */}
            {SocketState.meyerInfo &&
              SocketState.thisGame.gamePlayers[index] ===
                SocketState.meyerInfo.currentPlayer &&
              !SocketState.meyerInfo.isGameOver && (
                <Box display="flex" bgcolor={colors.primary[500]}>
                  <ArrowForwardOutlined />
                </Box>
              )}
            {SocketState.meyerInfo &&
              !(
                SocketState.thisGame.gamePlayers[index] ===
                  SocketState.meyerInfo.currentPlayer &&
                !SocketState.meyerInfo.isGameOver
              ) && <Box paddingLeft="calc(20.5px + 5px)" />}
            {/* DICE ICON */}
            {((SocketState.meyerInfo?.healths &&
              (SocketState.meyerInfo.healths[index] > 0 ||
                SocketState.thisGame.owner === SocketState.uid)) ||
              !SocketState.meyerInfo?.healths) && (
              <Box display="flex">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{
                    opacity:
                      changingOwner &&
                      SocketState.thisGame.gamePlayers[index] ===
                        SocketState.uid
                        ? 0.5
                        : 1,
                  }}
                >
                  <Dice
                    eyes={
                      SocketState.meyerInfo
                        ? SocketState.meyerInfo?.healths[index]
                        : 6
                    }
                    color={colors.blueAccent[100]}
                    sideLength={25}
                  />
                </Box>
                <Box marginRight="3px" />
              </Box>
            )}

            {/* NAME */}
            {((SocketState.meyerInfo?.healths &&
              (SocketState.meyerInfo.healths[index] > 0 ||
                SocketState.thisGame.owner === SocketState.uid)) ||
              !SocketState.meyerInfo?.healths) && (
              <Box
                display="flex"
                //flexDirection="column"
                justifyContent="center"
                height="24px"
                onDoubleClick={() => {
                  if (
                    !changingOwner &&
                    SocketState.thisGame.gamePlayers[index] ===
                      SocketState.uid &&
                    !SocketState.thisGame.isInProgress
                  )
                    onEdit();
                }}
                sx={{
                  inset: 0,
                  opacity:
                    changingOwner &&
                    SocketState.thisGame.gamePlayers[index] === SocketState.uid
                      ? 0.5
                      : 1,
                }}
              >
                <Typography
                  fontSize={
                    !queryMatches && SocketState.thisGame.isInProgress
                      ? "10px"
                      : "14px"
                  }
                  style={{
                    wordBreak: "break-all",
                    textAlign: "center",
                  }}
                  color={
                    SocketState.thisGame.gamePlayersTimeout.includes(
                      SocketState.thisGame.gamePlayers[index],
                    )
                      ? colors.grey[500]
                      : undefined
                  }
                  component="span"
                  children={
                    <Box>
                      {(!toggleEditName ||
                        SocketState.thisGame.gamePlayers[index] !==
                          SocketState.uid) && (
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
                          {!changingOwner &&
                            SocketState.thisGame.gamePlayers[index] ===
                              SocketState.uid &&
                            !SocketState.thisGame.isInProgress &&
                            EditNameButton()}
                        </>
                      )}
                      {toggleEditName &&
                        !SocketState.thisGame.isInProgress &&
                        SocketState.thisGame.gamePlayers[index] ===
                          SocketState.uid &&
                        InputNameElement(index)}
                      {!changingOwner &&
                        SocketState.thisGame.owner === SocketState.uid &&
                        SocketState.thisGame.gamePlayers[index] !==
                          SocketState.uid &&
                        KickPlayerButton(
                          SocketState.thisGame.gamePlayers[index],
                        )}
                      {SocketState.thisGame.owner ===
                        SocketState.thisGame.gamePlayers[index] &&
                        !toggleEditName &&
                        Star()}
                      {changingOwner &&
                        SocketState.thisGame.owner !==
                          SocketState.thisGame.gamePlayers[index] &&
                        !toggleEditName &&
                        hovered === SocketState.thisGame.gamePlayers[index] &&
                        Star()}
                    </Box>
                  }
                />
                {toggleEditName &&
                  !SocketState.thisGame.isInProgress &&
                  SocketState.thisGame.gamePlayers[index] === SocketState.uid &&
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
