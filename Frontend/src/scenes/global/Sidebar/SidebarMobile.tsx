//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Menu, Sidebar } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { tokens } from "../../../theme";
import { Dice } from "../../../utils/diceUtils";
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
      >
        <Menu>
          {/* LOGO */}
          <Box
            display="flex"
            justifyContent="center"
            minHeight="80px"
            flexDirection="column"
          >
            <Box position="absolute" top={2} right={2}>
              <IconButton onClick={() => setIsVisible(false)}>
                <CloseOutlined />
              </IconButton>
            </Box>
            <MeyerLogo />
          </Box>
          {/* MENU ITEMS */}
          <MenuItems
            isDanish={isDanish}
            paddingLeft="10%"
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMobile;
