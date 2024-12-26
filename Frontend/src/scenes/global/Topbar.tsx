//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { ReactNode, useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { LightModeOutlined } from "@mui/icons-material";
import { DarkModeOutlined } from "@mui/icons-material";
import { Search } from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { Outlet } from "react-router-dom";
import Home from "../Home/Home";

interface Props {
  children: ReactNode;
  isDanish: boolean;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ children, isDanish, setIsDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [hovered, setHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  return (
    <Box
      justifyContent="space-between"
      p={2}
      display="flex"
      alignItems="flex-start"
      flexWrap="wrap"
      flexBasis="100%"
      marginBottom="auto"
    >
      {/* SEARCH BAR */}
      <Box display="flex" bgcolor={colors.primary[600]} borderRadius="3px">
        <InputBase
          id="search-bar"
          sx={{ ml: 2, flex: 1, color: colors.grey[400] }}
          placeholder={isDanish ? "DEN HER GØR INTET" : "THIS DOES NOTHING"}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <Search />
        </IconButton>
      </Box>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
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
      <Outlet />
      {children}
    </Box>
  ); //css properties directly
};

export default Topbar;
