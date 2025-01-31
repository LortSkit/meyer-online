import { useTheme, Box, InputBase } from "@mui/material";
import { tokens } from "../../../theme";

interface Props {
  setLobbyName: React.Dispatch<React.SetStateAction<string>>;
}

const SetLobbyName = ({ setLobbyName }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setLobbyName(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 25);
  }
  return (
    <Box bgcolor={colors.primary[600]} width="max-content">
      <InputBase
        id="lobby-name-bar"
        sx={{
          ml: 1,
          mr: 1,
          width: "315px",
          color: colors.grey[400],
          fontSize: "16px",
        }}
        type="text"
        required={true}
        inputProps={{
          maxLength: 25,
        }}
        inputMode="text"
        onChange={onChange}
        onInput={onInput}
      />
    </Box>
  );
};

export default SetLobbyName;
