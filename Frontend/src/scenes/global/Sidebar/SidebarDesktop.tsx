//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import creator from "../../../assets/alek.jpg";
import MenuItems from "./MenuItems";
import User from "./User";
import MeyerLogo from "./MeyerLogo";

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
      zIndex={2}
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
                //ml="15px"
              >
                <MeyerLogo />
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {!isCollapsed && <User isDanish={isDanish} img={creator} />}
          {/* MENU ITEMS */}
          <MenuItems
            isDanish={isDanish}
            paddingLeft={isCollapsed ? undefined : "10%"}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarDesktop;
