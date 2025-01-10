import { useTheme, Box, InputBase } from "@mui/material";
import { tokens } from "../../../theme";
import { translateNumberOfPlayers } from "../../../utils/lang/Create/CreateNewGame/langSetNumberOfPlayers";

interface Props {
  isDanish: boolean;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
}

const SetNumberOfPlayers = ({ isDanish, setNumberOfPlayers }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNumberOfPlayers(Number(event.target.value));
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    Number(event.target.value) >= 10 && event.target.value.slice(0, 2) == "10"
      ? (event.target.value = "10")
      : (event.target.value = event.target.value.slice(
          event.target.value.length - 1,
          event.target.value.length
        ));
  }
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center">
          {translateNumberOfPlayers(isDanish)}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          bgcolor={colors.primary[600]}
        >
          <InputBase
            id="num-players-bar"
            sx={{
              ml: 1,
              mr: 0,
              color: colors.grey[400],
            }}
            type="number"
            required={true}
            inputProps={{
              min: 2,
              max: 10,
              maxLength: 2,
            }}
            inputMode="tel"
            onChange={onChange}
            onInput={onInput}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SetNumberOfPlayers;
