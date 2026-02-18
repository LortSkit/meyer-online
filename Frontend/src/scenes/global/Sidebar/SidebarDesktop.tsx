//Stolen from https://github.com/ed-roh/react-admin-dashboard

import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import { useState } from "react";
import { Sidebar, Menu } from "react-pro-sidebar";
import creator from "../../../assets/alek.jpg";
import MenuItems from "./MenuItems/MenuItems";
import User from "./User";
import MeyerLogoMenuItem from "./MeyerLogoMenuItem/MeyerLogoMenuItem";
import { tokens } from "../../../theme";

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
      zIndex={3}
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
