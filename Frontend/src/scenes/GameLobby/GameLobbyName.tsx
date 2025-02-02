import { Box, InputBase, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { Socket } from "socket.io-client";

interface Props {
  name: string;
  socket: Socket;
}

const GameLobbyName = ({ name, socket }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [toggle, setToggle] = useState(false);
  const [lobbyNameChanger, setLobbyNameChanger] = useState(name);

  function onBlur() {
    setToggle(!toggle);
    setLobbyNameChanger(name);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      //TODO: Implement the socket event!
      socket.emit("heyyyyyyyy");
    } else if (event.key === "Escape") {
      onBlur();
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setLobbyNameChanger(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 12);
  }

  useEffect(() => {
    setLobbyNameChanger(name);
  }, [name]);

  useEffect(() => {
    console.log(`toggle ${toggle}`);
    if (toggle) {
      document.getElementById("lobby-name-bar")?.focus();
    }
  }, [toggle]);

  return (
    <Box display="flex" justifyContent="center">
      {!toggle && (
        <Typography
          variant="h1"
          fontStyle="normal"
          textTransform="none"
          style={{
            wordBreak: "break-all",
            textAlign: "center",
          }}
          onDoubleClick={() => {
            setToggle(true);
          }}
          children={<strong>{name}</strong>}
        />
      )}
      {toggle && (
        <Box
          display="flex"
          bgcolor={colors.primary[600]}
          borderRadius="3px"
          onBlur={onBlur}
        >
          <InputBase
            id="lobby-name-bar"
            sx={{
              color: colors.grey[400],
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
  );
};

export default GameLobbyName;
