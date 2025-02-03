import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Search } from "@mui/icons-material";
import { translateSearchForLobby } from "../utils/lang/components/langSearchBar";
import { useLocation, useNavigate } from "react-router-dom";
import { base } from "../utils/hostSubDirectory";
import React, { useEffect, useState } from "react";

interface Props {
  isDanish: boolean;
  searchLobbyName: string;
  width?: string;
  setSearchLobbyName: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({
  isDanish,
  searchLobbyName,
  width,
  setSearchLobbyName,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navigate = useNavigate();

  const location = useLocation();
  const { hash, pathname, search } = location;

  const [blockBlur, setBlockBlur] = useState(false);

  const [searchingColor, setSearchingColor] = useState(colors.primary[600]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSearchLobbyName(event.target.value);
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.target.value = event.target.value.slice(0, 25);
  }

  function onClickSearch(): void {
    const searchBar = document.getElementById("search-bar") as any;
    if (searchLobbyName !== "" && pathname !== "/find") {
      navigate(base + "/find");
    } else {
      searchBar.focus();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onClickSearch();
    }
  }

  useEffect(() => {
    if (pathname === "/find") {
      document.getElementById("search-bar")?.focus();
    }
  }, []);

  useEffect(() => {
    setSearchingColor(colors.primary[600]);
  }, [localStorage.getItem("mode")]);

  return (
    <Box
      display="flex"
      bgcolor={searchingColor}
      borderRadius="3px"
      onMouseOver={() => setBlockBlur(true)}
      onMouseOut={() => setBlockBlur(false)}
    >
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
        value={searchLobbyName}
        onBlur={() => {
          if (!blockBlur) {
            const thisElement = document.getElementById("search-bar") as any;
            thisElement.value = "";
            setSearchingColor(colors.primary[600]);
            setSearchLobbyName("");
          }
        }}
        autoComplete="off"
        onFocus={() => setSearchingColor(colors.primary[700])}
        onChange={onChange}
        onInput={onInput}
        onKeyDown={onKeyDown}
        placeholder={translateSearchForLobby(isDanish)}
      />
      <IconButton id="search-button" sx={{ p: 1 }} onClick={onClickSearch}>
        <Search />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
