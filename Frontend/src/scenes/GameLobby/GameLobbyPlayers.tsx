import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { translatePlayers } from "../../utils/lang/GameLobby/langGameLobbyPlayers";
import { Edit } from "@mui/icons-material";
import { Socket } from "socket.io-client";

interface Props {
  isDanish: boolean;
  isOwner: boolean;
  numberOfPlayers: number;
  maxNumberOfPlayers: number;
  socket: Socket;
}

const GameLobbyPlayers = ({
  isDanish,
  isOwner,
  numberOfPlayers,
  maxNumberOfPlayers,
  socket,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [toggleEditMax, setToggleEditMax] = useState(false);
  const [editMaxChanger, setEditMaxNameChanger] = useState(
    String(maxNumberOfPlayers)
  );

  function onBlur() {
    setToggleEditMax(false);
    setEditMaxNameChanger(String(maxNumberOfPlayers));
  }

  function onEdit(): void {
    if (isOwner) {
      setToggleEditMax(true);
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEditMaxNameChanger(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    function fallback() {
      event.target.value = event.target.value.slice(0, 2);
    }

    event.target.value.slice(0, 1) === "0" && event.target.value.length > 1
      ? (event.target.value = event.target.value.slice(1, 2))
      : 20 < Number(event.target.value)
      ? (event.target.value = "20")
      : fallback();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      socket.emit("change_max_players", Number(editMaxChanger));
      onBlur();
    } else if (event.key === "Escape") {
      onBlur();
    }
  }

  useEffect(() => {
    setEditMaxNameChanger(String(maxNumberOfPlayers));
  }, [maxNumberOfPlayers]);

  useEffect(() => {
    if (toggleEditMax) {
      const input = document.getElementById(
        "max-players-bar"
      ) as HTMLInputElement;
      input?.focus();
    }
  }, [toggleEditMax]);

  return (
    <Box onDoubleClick={onEdit} p={1}>
      <Box display="flex" justifyContent="center" height="24px">
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          height="22px"
        >
          <Typography
            display="flex"
            justifyContent="center"
            fontSize="16px"
            component="span"
          >
            {translatePlayers(isDanish)}
            <Box paddingLeft="5px" />
            {numberOfPlayers}/
            {!toggleEditMax && (
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                width={isOwner ? "40px" : undefined}
              >
                <Box paddingLeft="2px" />
                {maxNumberOfPlayers}
                {isOwner && (
                  <IconButton
                    onClick={onEdit}
                    sx={{
                      position: "fixed",
                      width: "20px",
                      height: "20px",
                      transform: "translateX(100%)",
                    }}
                  >
                    <Edit sx={{ width: "15px" }} />
                  </IconButton>
                )}
              </Box>
            )}
          </Typography>
        </Box>
        {toggleEditMax && (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Box paddingLeft="2px" />
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              bgcolor={colors.primary[600]}
              borderRadius="3px"
              onBlur={onBlur}
            >
              <InputBase
                id="max-players-bar"
                sx={{
                  color: colors.blackAccent[100],
                  width: "40px",
                  fontSize: "16px",
                  "& .MuiInputBase-inputMultiline": {
                    padding: "0",
                    align: "left",
                    wordBreak: "break-all",
                    textAlign: "left",
                    "& input": {
                      textAlign: "left",
                    },
                  },
                }}
                type="number"
                required={true}
                inputProps={{
                  min: 2,
                  max: 20,
                  maxLength: 2,
                  pattern: "[0-9]*",
                }}
                inputMode="tel"
                fullWidth
                value={editMaxChanger}
                onChange={onChange}
                onInput={onInput}
                onKeyDown={onKeyDown}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GameLobbyPlayers;
