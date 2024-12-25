//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { Component, ReactNode, useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { LightModeOutlined } from "@mui/icons-material";
import { DarkModeOutlined } from "@mui/icons-material";
import { Search } from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { Outlet } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      justifyContent="space-between"
      p={2}
      sx={{
        display: "flex",
        flexBasis: "100%",
        height: "13%",
      }}
    >
      {/* SEARCH BAR */}
      <Box display="flex" bgcolor={colors.primary[800]} borderRadius="3px">
        <InputBase
          id="search-bar"
          sx={{ ml: 2, flex: 1, color: colors.grey[400] }}
          placeholder="THIS DOES NOTHING"
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
        <IconButton>
          {/* TODO: Make a proper language button using these two flags */}
          <span className="fi fi-dk"></span>
          <span className="fi fi-gb"></span>
        </IconButton>
      </Box>
      <Outlet />
    </Box>
  ); //css properties directly
};

export default Topbar;
