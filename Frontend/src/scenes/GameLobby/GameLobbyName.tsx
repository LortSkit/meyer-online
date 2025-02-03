import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { Socket } from "socket.io-client";
import { Edit, LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import {
  translateEditLobbyName,
  translatePrivate,
  translatePublic,
} from "../../utils/lang/GameLobby/langGameLobbyName";

interface Props {
  isDanish: boolean;
  isOwner: boolean;
  isPublic: boolean;
  name: string;
  socket: Socket;
}

const GameLobbyName = ({
  isDanish,
  isOwner,
  isPublic,
  name,
  socket,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [toggleEditLobbyName, setToggleEditLobbyName] = useState(false);
  const [lobbyNameChanger, setLobbyNameChanger] = useState(name);

  const [toggleEditLobbyNameIcon, setToggleEditLobbyNameIcon] =
    useState(isOwner);

  function onBlur() {
    setToggleEditLobbyName(false);
    setLobbyNameChanger(name);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      socket.emit("change_lobby_name", lobbyNameChanger);
      onBlur();
    } else if (event.key === "Escape") {
      onBlur();
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setLobbyNameChanger(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 25);
  }

  function onEdit(): void {
    if (isOwner) {
      setToggleEditLobbyName(true);
    }
  }

  function togglePublicPrivate(): void {
    if (isOwner) {
      socket.emit("toggle_public_private");
    }
  }

  useEffect(() => {
    setLobbyNameChanger(name);
  }, [name]);

  useEffect(() => {
    if (toggleEditLobbyName) {
      const input = document.getElementById(
        "lobby-name-bar"
      ) as HTMLInputElement;
      input?.focus();
      input?.setSelectionRange(input?.value.length, input?.value.length);
    }
  }, [toggleEditLobbyName]);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="center">
        {/* NOT EDITING */}
        {!toggleEditLobbyName && (
          <Typography
            variant="h1"
            fontStyle="normal"
            textTransform="none"
            paddingTop="9.5px"
            paddingBottom="10.8px"
            style={{
              wordBreak: "break-all",
              textAlign: "center",
            }}
            onDoubleClick={onEdit}
            children={<strong>{name}</strong>}
          />
        )}

        {/* EDITING */}
        {toggleEditLobbyName && (
          <Box
            display="flex"
            bgcolor={colors.primary[600]}
            borderRadius="3px"
            onBlur={onBlur}
          >
            <InputBase
              id="lobby-name-bar"
              sx={{
                color: colors.blackAccent[100],
                fontSize: "40px",
                fontStyle: "normal",
                textTransform: "none",
                fontWeight: "bold",
                width: "100%",
                "& .MuiInputBase-inputMultiline": {
                  padding: "0",
                  align: "center",
                  wordBreak: "break-all",
                  textAlign: "center",
                  "& input": {
                    textAlign: "center",
                  },
                },
              }}
              multiline
              type="text"
              required={true}
              inputProps={{
                maxLength: 25,
              }}
              fullWidth
              inputMode="text"
              value={lobbyNameChanger}
              onChange={onChange}
              onInput={onInput}
              onKeyDown={onKeyDown}
            />
          </Box>
        )}
      </Box>
      {isOwner && (
        <Box display="flex" justifyContent="center">
          {/* EDIT NAME */}
          <IconButton onClick={onEdit} disabled={toggleEditLobbyName}>
            <Typography
              fontSize="16px"
              children={translateEditLobbyName(isDanish)}
            />

            <Edit />
          </IconButton>

          {/* TOGGLE PUBLIC/PRIVATE */}
          <IconButton onClick={togglePublicPrivate}>
            <Typography
              fontSize="16px"
              children={
                isPublic
                  ? translatePublic(isDanish)
                  : translatePrivate(isDanish)
              }
            />

            {!isPublic && <LockOutlined />}
            {isPublic && <LockOpenOutlined />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default GameLobbyName;
