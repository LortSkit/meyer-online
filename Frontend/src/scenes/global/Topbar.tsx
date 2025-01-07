//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  MenuOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  Search,
} from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDanish: boolean;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ isVisible, setIsVisible, isDanish, setIsDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [hovered, setHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  return (
    <Box
      position="sticky"
      top="0"
      bgcolor={colors.primary[500]}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      padding="10px 16px 10px 16px"
      zIndex={1}
      sx={{ outline: "1px solid", outlineColor: colors.primary[600] }}
    >
      {/* MOBILE MENU + SEARCH BAR */}
      <Box
        display="flex"
        bgcolor={colors.primary[600]}
        borderRadius="3px"
        justifyContent="space-between"
      >
        {/* MENU BUTTON - Only visible if screen is small enough */}
        <div
          className="menuButtonMobile"
          style={{ backgroundColor: colors.primary[500] }}
        >
          <IconButton onClick={() => setIsVisible(true)}>
            <MenuOutlined />
          </IconButton>
          <Box p={1} />
        </div>

        {/* SEARCH BAR */}
        <Box display="flex">
          <InputBase
            id="search-bar"
            sx={{ ml: 2, flex: 1, color: colors.grey[400] }}
            placeholder={isDanish ? "DEN HER GØR INTET" : "THIS DOES NOTHING"}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <Search />
          </IconButton>
        </Box>
      </Box>
      {/* ICONS */}
      <Box display="flex" borderRadius="3px">
        <IconButton
          onClick={() => {
            localStorage.setItem(
              "mode",
              localStorage.getItem("mode") === "dark" ? "light" : "dark"
            );
            colorMode.toggleColorMode();
          }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            localStorage.setItem("isDanish", String(!isDanish));
            setIsDanish(!isDanish);
            setJustClicked(true);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(!hovered);
            setJustClicked(false);
          }}
        >
          {isDanish == (hovered == justClicked) ? (
            <span className="fi fi-dk"></span>
          ) : (
            <span className="fi fi-gb"></span>
          )}
        </IconButton>
      </Box>
    </Box>
  ); //css properties directly
};

export default Topbar;
