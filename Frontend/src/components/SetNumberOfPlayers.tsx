import { useTheme, Box, InputBase } from "@mui/material";
import { tokens } from "../theme";

interface Props {
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const SetNumberOfPlayers = ({ setNumberOfPlayers }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNumberOfPlayers(Number(event.target.value));
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    function fallback() {
      event.target.value = event.target.value.slice(0, 2);
    }

    event.target.value.slice(0, 1) === "0"
      ? (event.target.value = "")
      : 20 < Number(event.target.value)
      ? (event.target.value = "20")
      : fallback();
  }
  return (
    <Box bgcolor={colors.primary[600]} width="50px">
      <InputBase
        id="num-players-bar"
        sx={{
          ml: 1,
          mr: 0,
          color: colors.grey[400],
          fontSize: "16px",
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
        onChange={onChange}
        onInput={onInput}
      />
    </Box>
  );
};

export default SetNumberOfPlayers;
