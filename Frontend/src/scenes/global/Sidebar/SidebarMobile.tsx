//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Box, IconButton, useTheme } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import MenuItems from "./MenuItems";
import MeyerLogo from "./MeyerLogo";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDanish: boolean;
}

const SidebarMobile = ({ isVisible, setIsVisible, isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("");

  return (
    <div
      className="sidebarMobile"
      style={{ backgroundColor: colors.primary[700] }}
    >
      <Sidebar
        collapsed={!isVisible}
        backgroundColor={colors.primary[700]}
        collapsedWidth="0px"
        style={{ height: "100%" }}
        rootStyles={{ border: "0" }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => {
              localStorage.setItem("isCollapsed", String(!isVisible));
              setIsVisible(!isVisible);
            }}
            icon={<MenuOutlined />}
            style={{
              margin: "3.5px 0 20px 0",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              //ml="15px"
            >
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                <MeyerLogo />
              </IconButton>
            </Box>
          </MenuItem>
          {/* MENU ITEMS */}
          <MenuItems
            isDanish={isDanish}
            paddingLeft="10%"
            selected={selected}
            setSelected={(s) => {
              setSelected(s);
              setIsVisible(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMobile;
