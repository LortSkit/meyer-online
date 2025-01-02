//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  HomeOutlined,
  MenuOutlined,
  PeopleOutlined,
  CasinoOutlined,
  HelpOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import Item from "../../components/Item";
import creator from "../../assets/alek.jpg";

interface Props {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isDanish: boolean;
}

const SidebarDesktop = ({ isCollapsed, setIsCollapsed, isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("");
  return (
    <Box
      position="sticky"
      height="100%"
      top="0"
      bgcolor={colors.primary[700]}
      zIndex={1}
    >
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary[700]}
        collapsedWidth="75px"
        style={{ minHeight: "100vh" }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => {
              localStorage.setItem("isCollapsed", String(!isCollapsed));
              setIsCollapsed(!isCollapsed);
            }}
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
            <Box>
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
    </Box>
  );
};

export default SidebarDesktop;
