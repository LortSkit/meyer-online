//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { ReactNode, useState } from "react";
import { Sidebar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { HomeOutlined, MenuOutlined } from "@mui/icons-material";
import { PeopleOutlined } from "@mui/icons-material";
import { CasinoOutlined } from "@mui/icons-material";
import { HelpOutlined } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";
import creator from "../../assets/alek.jpg";

interface ItemProps {
  title: string;
  to: string;
  icon: ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item = ({ title, to, icon, selected, setSelected }: ItemProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={"span"}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

interface Props {
  children: ReactNode;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarComp = ({ children, isCollapsed, setIsCollapsed }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("");
  return (
    <Box display="flex">
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary[700]}
        collapsedWidth="75px"
        style={{
          display: "flex",
          flexShrink: "1",
          flexGrow: "0",
        }}
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
              //color: colors.grey[900],
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
                <Typography variant="h5" color={colors.blackAccent[100]}>
                  Creator of this page
                </Typography>
              </Box>
            </Box>
          )}
          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Create Game"
              to="/"
              icon={<CasinoOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Find Games"
              to="/"
              icon={<PeopleOutlined />}
              selected={selected}
              setSelected={setSelected}
            ></Item>
          </Box>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Rules"
              to="/"
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
