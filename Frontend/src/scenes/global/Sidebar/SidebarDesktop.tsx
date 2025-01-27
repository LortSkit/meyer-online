//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, useTheme } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import creator from "../../../assets/alek.jpg";
import MenuItems from "./MenuItems/MenuItems";
import User from "./User";
import MeyerLogo from "./MeyerLogoMenuItem/MeyerLogo";
import MeyerLogoMenuItem from "./MeyerLogoMenuItem/MeyerLogoMenuItem";

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
        rootStyles={{
          border: "0",
          borderRight: `1px solid ${colors.blackAccent[300]}`,
        }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MeyerLogoMenuItem
            isSidebarVisible={isCollapsed}
            setIsSidebarVisible={setIsCollapsed}
          />
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
