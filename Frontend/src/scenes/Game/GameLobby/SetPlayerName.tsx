import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import useTheme from "@mui/material/styles/useTheme";
import { tokens } from "../../../theme";
import { Socket } from "socket.io-client";

interface Props {
  chosenPlayerName: string;
  socket: Socket;
  setChosenPlayerName: React.Dispatch<React.SetStateAction<string>>;
}

const SetPlayerName = ({
  chosenPlayerName,
  socket,
  setChosenPlayerName,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      socket.emit("change_player_name", chosenPlayerName);
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setChosenPlayerName(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 12);
  }
  return (
    <Box bgcolor={colors.primary[600]} width="max-content">
      <InputBase
        id="player-name-bar"
        sx={{
          ml: 1,
          mr: 1,
          width: "152px",
          color: colors.grey[400],
          fontSize: "16px",
        }}
        type="text"
        required={true}
        inputProps={{
          maxLength: 12,
        }}
        inputMode="text"
        value={chosenPlayerName}
        onChange={onChange}
        onInput={onInput}
        onKeyDown={onKeyDown}
      />
    </Box>
  );
};

export default SetPlayerName;
