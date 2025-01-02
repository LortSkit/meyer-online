//Stolen from https://github.com/ed-roh/react-admin-dashboard

import { Box, InputBase, IconButton, useTheme } from "@mui/material";
import { ReactNode, useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Search,
} from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface Props {
  children: ReactNode;
  isDanish: boolean;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ children, isDanish, setIsDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [hovered, setHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexBasis="100%"
      paddingBottom="10px"
    >
      <Box
        position="sticky"
        top="0"
        bgcolor={colors.primary[500]}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        padding="16px 16px 10px 16px"
      >
        {/* SEARCH BAR */}
        <Box display="flex" bgcolor={colors.primary[600]} borderRadius="3px">
          <InputBase
            id="search-bar"
            sx={{ ml: 2, flex: 1, color: colors.grey[400] }}
            placeholder={isDanish ? "DEN HER GØR INTET" : "THIS DOES NOTHING"}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <Search />
          </IconButton>
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
      {children}
    </Box>
  ); //css properties directly
};

export default Topbar;
