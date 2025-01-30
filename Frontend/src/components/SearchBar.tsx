import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Search } from "@mui/icons-material";
import { translateSearchForLobby } from "../utils/lang/components/langSearchBar";
import { useNavigate } from "react-router-dom";
import { base } from "../utils/hostSubDirectory";

interface Props {
  isDanish: boolean;
  searchBarRef: any;
  retainValue: boolean;
  width?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({
  isDanish,
  searchBarRef,
  retainValue,
  width,
  onChange,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 25);
  }

  return (
    <Box display="flex" bgcolor={colors.primary[600]} borderRadius="3px">
      <InputBase
        id="search-bar"
        sx={{
          ml: 2,
          mr: 1,
          width: width,
          fontSize: "16px",
        }}
        inputProps={{
          maxLength: 25,
        }}
        inputRef={searchBarRef}
        value={
          retainValue
            ? searchBarRef.value
              ? searchBarRef.value
              : ""
            : undefined
        }
        onBlur={() => {
          if (!retainValue) {
            navigate(base + "/find");
          }
        }}
        onChange={onChange}
        onInput={onInput}
        placeholder={translateSearchForLobby(isDanish)}
      />
      <IconButton sx={{ p: 1 }}>
        <Search />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
