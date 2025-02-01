import { useTheme, Box, InputBase } from "@mui/material";
import { tokens } from "../../theme";

interface Props {
    value: string;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setChosenPlayerName: React.Dispatch<React.SetStateAction<string>>;
}

const SetPlayerName = ({ value, onKeyDown, setChosenPlayerName }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        value={value}
        onChange={onChange}
        onInput={onInput}
        onKeyDown={onKeyDown}
      />
    </Box>
  );
};

export default SetPlayerName;
