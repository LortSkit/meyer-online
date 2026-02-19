import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Edit from "@mui/icons-material/Edit";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import StarOutlined from "@mui/icons-material/StarOutlined";
import { Dice } from "../../../utils/diceUtils";
import loading from "../../../assets/discordLoadingDotsDiscordLoading.gif";
import { useGlobalContext } from "../../../contexts/Socket/SocketContext";
import { useMediaQuery } from "usehooks-ts";
import InputBase from "@mui/material/InputBase";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import useTheme from "@mui/material/styles/useTheme";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  nameindex: number;
  index: number;
  currentName: (uid: string) => string;
  changingOwner: boolean;
  setChangingOwner: React.Dispatch<React.SetStateAction<boolean>>;
  reordering: boolean;
  setReordering: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerEntries = ({
  nameindex,
  index,
  currentName,
  changingOwner,
  setChangingOwner,
  reordering,
  setReordering,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { SocketState, SocketDispatch } = useGlobalContext();

  const [toggleEditName, setToggleEditName] = useState(false);

  const [nameChanger, setNameChanger] = useState(
    currentName(SocketState.meyerInfo?.currentPlayer),
  );

  const queryMatches = useMediaQuery("only screen and (min-width: 790px)");

  const [hovered, setHovered] = useState("");

  const [disableDnD, setDisableDnD] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: nameindex, disabled: disableDnD });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function numberAfterName(name: string, index: number): string {
    const actualNameOrder = SocketState.thisGame?.gamePlayersOrder.map(
      (value) => SocketState.thisGame?.gamePlayersNames[value - 1],
    );
    if (index === 0) {
      return actualNameOrder.slice(1, actualNameOrder.length).includes(name)
        ? " (1)"
        : "";
    } else {
      const previousNames = actualNameOrder.slice(0, index);
      if (previousNames.includes(name)) {
        let i = 0;
        previousNames.forEach((value) => {
          if (value === name) {
            i++;
          }
        });

        return " (" + (i + 1) + ")";
      } else if (
        actualNameOrder.slice(index + 1, actualNameOrder.length).includes(name)
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

  function properlySetDisableDnD() {
    if (
      SocketState.thisGame.owner === SocketState.uid &&
      !toggleEditName &&
      !changingOwner &&
      reordering
    ) {
      setDisableDnD(false);
    } else {
      setDisableDnD(true);
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
    properlySetDisableDnD();
  }, [toggleEditName]);

  // useEffect(() => {
  //   if (isDragging) {
  //     setToggleEditName(false);
  //   }
  // }, [isDragging]);

  useEffect(() => {
    properlySetDisableDnD();
  }, [SocketState.thisGame.owner, changingOwner]);

  useEffect(() => {
    if (reordering) {
      setDisableDnD(false);
    } else {
      setDisableDnD(true);
    }
  }, [reordering]);

  return (
    <Box
      display="flex"
      key={index}
      onMouseEnter={() =>
        setHovered(
          SocketState.thisGame.gamePlayers[
            SocketState.thisGame.gamePlayersOrder[index] - 1
          ],
        )
      }
      onMouseLeave={() => {
        setHovered("");
      }}
      onClick={() => {
        if (
          changingOwner &&
          SocketState.thisGame.gamePlayers[
            SocketState.thisGame.gamePlayersOrder[index] - 1
          ] !== SocketState.uid
        ) {
          setChangingOwner(false);
          SocketState.socket?.emit(
            "change_owner",
            SocketState.thisGame.gamePlayers[
              SocketState.thisGame.gamePlayersOrder[index] - 1
            ],
          );
        }
      }}
      sx={{
        cursor:
          changingOwner &&
          SocketState.thisGame.gamePlayers[
            SocketState.thisGame.gamePlayersOrder[index] - 1
          ] !== SocketState.uid
            ? "pointer"
            : "auto",
        touchAction: "none",
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <Box display="flex">
        {/* ARROW - (if wanted) */}
        {SocketState.meyerInfo &&
          SocketState.thisGame.gamePlayers[
            SocketState.thisGame.gamePlayersOrder[index] - 1
          ] === SocketState.meyerInfo.currentPlayer &&
          !SocketState.meyerInfo.isGameOver && (
            <Box display="flex" bgcolor={colors.primary[500]}>
              <ArrowForwardOutlined />
            </Box>
          )}
        {SocketState.meyerInfo &&
          !(
            SocketState.thisGame.gamePlayers[
              SocketState.thisGame.gamePlayersOrder[index] - 1
            ] === SocketState.meyerInfo.currentPlayer &&
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
                  SocketState.thisGame.gamePlayers[
                    SocketState.thisGame.gamePlayersOrder[index] - 1
                  ] === SocketState.uid
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
            flexDirection="column"
            justifyContent="center"
            //height="24px"
            onDoubleClick={() => {
              if (
                !changingOwner &&
                SocketState.thisGame.gamePlayers[
                  SocketState.thisGame.gamePlayersOrder[index] - 1
                ] === SocketState.uid &&
                !SocketState.thisGame.isInProgress
              )
                onEdit();
            }}
            sx={{
              inset: 0,
              opacity:
                changingOwner &&
                SocketState.thisGame.gamePlayers[
                  SocketState.thisGame.gamePlayersOrder[index] - 1
                ] === SocketState.uid
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
                  SocketState.thisGame.gamePlayers[
                    SocketState.thisGame.gamePlayersOrder[index] - 1
                  ],
                )
                  ? colors.grey[500]
                  : undefined
              }
              component="span"
              children={
                <Box>
                  {(!toggleEditName ||
                    SocketState.thisGame.gamePlayers[
                      SocketState.thisGame.gamePlayersOrder[index] - 1
                    ] !== SocketState.uid) && (
                    <>
                      {SocketState.thisGame.gamePlayersNames[nameindex - 1] !==
                        "" &&
                        SocketState.thisGame.gamePlayersNames[nameindex - 1]}
                      {SocketState.thisGame.gamePlayersNames[nameindex - 1] ===
                        "" && (
                        <img
                          src={loading}
                          width="35px"
                          style={{ paddingLeft: "5px" }}
                        />
                      )}
                      {numberAfterName(
                        SocketState.thisGame.gamePlayersNames[nameindex - 1],
                        index,
                      )}
                      {!changingOwner &&
                        !reordering &&
                        SocketState.thisGame.gamePlayers[
                          SocketState.thisGame.gamePlayersOrder[index] - 1
                        ] === SocketState.uid &&
                        !SocketState.thisGame.isInProgress &&
                        EditNameButton()}
                    </>
                  )}
                  {toggleEditName &&
                    !SocketState.thisGame.isInProgress &&
                    SocketState.thisGame.gamePlayers[
                      SocketState.thisGame.gamePlayersOrder[index] - 1
                    ] === SocketState.uid &&
                    InputNameElement(index)}
                  {!changingOwner &&
                    !reordering &&
                    SocketState.thisGame.owner === SocketState.uid &&
                    SocketState.thisGame.gamePlayers[
                      SocketState.thisGame.gamePlayersOrder[index] - 1
                    ] !== SocketState.uid &&
                    KickPlayerButton(
                      SocketState.thisGame.gamePlayers[
                        SocketState.thisGame.gamePlayersOrder[index] - 1
                      ],
                    )}
                  {SocketState.thisGame.owner ===
                    SocketState.thisGame.gamePlayers[
                      SocketState.thisGame.gamePlayersOrder[index] - 1
                    ] &&
                    !toggleEditName &&
                    Star()}
                  {changingOwner &&
                    SocketState.thisGame.owner !==
                      SocketState.thisGame.gamePlayers[
                        SocketState.thisGame.gamePlayersOrder[index] - 1
                      ] &&
                    !toggleEditName &&
                    hovered ===
                      SocketState.thisGame.gamePlayers[
                        SocketState.thisGame.gamePlayersOrder[index] - 1
                      ] &&
                    Star()}
                </Box>
              }
            />
            {toggleEditName &&
              !SocketState.thisGame.isInProgress &&
              SocketState.thisGame.gamePlayers[
                SocketState.thisGame.gamePlayersOrder[index] - 1
              ] === SocketState.uid &&
              ConfirmButton()}
          </Box>
        )}
      </Box>
      <Box paddingTop="27px" />
    </Box>
  );
};

export default PlayerEntries;
