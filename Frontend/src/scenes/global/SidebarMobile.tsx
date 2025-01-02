//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { useState } from "react";
import { Menu, Sidebar } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  HomeOutlined,
  CloseOutlined,
  PeopleOutlined,
  CasinoOutlined,
  HelpOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import Item from "../../components/Item";
import { Dice } from "../../utils/diceUtils";

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
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" justifyContent="center" flexBasis="100%">
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Dice
                    eyes={2}
                    color={colors.blueAccent[100]}
                    sideLength={24}
                  />
                </Box>
              </Box>
              <Typography
                variant="h2"
                color={colors.blueAccent[100]}
                fontWeight="bold"
                children={"Meyer"}
              />
              <Box display="flex" justifyContent="center" flexBasis="100%">
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Dice
                    eyes={1}
                    color={colors.blueAccent[100]}
                    sideLength={24}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {/* MENU ITEMS */}
          <Box marginLeft="30px">
            <Box>
              <Item
                title={isDanish ? "Hjem" : "Home"}
                to="/"
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
              ></Item>
            </Box>
            <Box>
              <Item
                title={isDanish ? "Opret et spil" : "Start a game"}
                to="/create"
                icon={<CasinoOutlined />}
                selected={selected}
                setSelected={setSelected}
              ></Item>
            </Box>
            <Box>
              <Item
                title={isDanish ? "Find spil" : "Find games"}
                to="/find"
                icon={<PeopleOutlined />}
                selected={selected}
                setSelected={setSelected}
              ></Item>
            </Box>
            <Box>
              <Item
                title={isDanish ? "Regler" : "Rules"}
                to="/rules"
                icon={<HelpOutlined />}
                selected={selected}
                setSelected={setSelected}
              ></Item>
            </Box>
          </Box>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMobile;
