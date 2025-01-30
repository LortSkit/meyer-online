//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  MenuOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  Search,
} from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { isInFind, isInLobby } from "../../utils/appUtils";
import { useNavigate } from "react-router-dom";
import { base } from "../../utils/hostSubDirectory";
import SearchBar from "../../components/SearchBar";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  isDanish: boolean;
  pathname: string;
  searchBarRef: any;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchLobbyName: React.Dispatch<React.SetStateAction<string>>;
}

const Topbar = ({
  isDanish,
  pathname,
  searchBarRef,
  setIsDanish,
  setIsVisible,
  setSearchLobbyName,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [hovered, setHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const queryMatches = useMediaQuery("only screen and (min-width: 400px)");

  const navigate = useNavigate();

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    searchBarRef.value = event.target.value;
    setSearchLobbyName(event.target.value);
    if (queryMatches) {
      navigate(base + "/find");
    }
  }

  return (
    <Box
      position="sticky"
      top="0"
      bgcolor={colors.primary[500]}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      padding="10px 16px 10px 16px"
      zIndex={1}
      sx={{ outline: "1px solid", outlineColor: colors.primary[600] }}
    >
      {/* MOBILE MENU + SEARCH BAR */}
      <Box display="flex" justifyContent="space-between">
        {/* MENU BUTTON - Only visible if screen is small enough */}
        {!isInLobby(pathname) && (
          <div
            className="menuButtonMobile"
            style={{
              backgroundColor: colors.primary[500],
              paddingLeft: "3px",
            }}
          >
            <IconButton onClick={() => setIsVisible(true)}>
              <MenuOutlined />
            </IconButton>
            <Box paddingLeft="35.4px" />
          </div>
        )}

        {/* SEARCH BAR */}
        {!isInLobby(pathname) && !isInFind(pathname) && (
          <SearchBar
            isDanish={isDanish}
            searchBarRef={searchBarRef}
            retainValue={false}
            onChange={onChange}
          />
        )}
      </Box>
      {/* ICONS */}
      <Box display="flex" borderRadius="3px">
        <IconButton
          onClick={() => {
            localStorage.setItem(
              "mode",
              localStorage.getItem("mode") === "dark" ? "light" : "dark"
            );
            colorMode.toggleColorMode();
          }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            localStorage.setItem("isDanish", String(!isDanish));
            setIsDanish(!isDanish);
            setJustClicked(true);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(!hovered);
            setJustClicked(false);
          }}
        >
          {isDanish == (hovered == justClicked) ? (
            <span className="fi fi-dk"></span>
          ) : (
            <span className="fi fi-gb"></span>
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
