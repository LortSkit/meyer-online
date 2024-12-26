//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { ReactNode, useState } from "react";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { HomeOutlined, MenuOutlined } from "@mui/icons-material";
import { PeopleOutlined } from "@mui/icons-material";
import { CasinoOutlined } from "@mui/icons-material";
import { HelpOutlined } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import Item from "../../components/Item";
import creator from "../../assets/alek.jpg";

interface Props {
  children: ReactNode;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isDanish: boolean;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarComp = ({
  children,
  isCollapsed,
  setIsCollapsed,
  isDanish,
  setIsDanish,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("");
  return (
    <Box display="flex" flexShrink="1" flexGrow="0">
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary[700]}
        collapsedWidth="75px"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            height: "100vh !important",
          },
          [`.${sidebarClasses.root}`]: {},
        }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.blackAccent[100]}>
                  Menu
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={creator}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.blueAccent[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Alexander Laukamp
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.blackAccent[100]}
                  children={
                    isDanish ? "Sideudvikleren" : "Creator of this page"
                  }
                />
              </Box>
            </Box>
          )}
          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title={isDanish ? "Hjem" : "Home"}
              to="/"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title={isDanish ? "Opret et spil" : "Start a game"}
              to="/create"
              icon={<CasinoOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title={isDanish ? "Find spil" : "Find games"}
              to="/find"
              icon={<PeopleOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title={isDanish ? "Regler" : "Rules"}
              to="/rules"
              icon={<HelpOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
        </Menu>
      </Sidebar>
      <Outlet />
      {children}
    </Box>
  );
};

export default SidebarComp;
