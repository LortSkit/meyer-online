import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import SidebarDesktop from "./scenes/global/SidebarDesktop";
import SidebarMobile from "./scenes/global/SidebarMobile";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./scenes/Home/Home";
import Create from "./scenes/Create/Create";
import Find from "./scenes/Find/Find";
import Rules from "./scenes/Rules/Rules";

const App = () => {
  const initIsCollapsed = localStorage.getItem("isCollapsed") === "true";

  const getIsDanish = localStorage.getItem("isDanish");
  const initIsDanish = getIsDanish != null ? getIsDanish === "true" : true;

  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(initIsCollapsed);
  const [isVisible, setIsVisible] = useState(false);
  const [isDanish, setIsDanish] = useState(initIsDanish);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SidebarDesktop
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isDanish={isDanish}
          />
          <div className="sidebarMobileWrapper">
            <SidebarMobile
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              isDanish={isDanish}
            />
            {isVisible && <div className="sidebarMobileOverlay"></div>}
          </div>
          <div className="rest">
            <Topbar
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              isDanish={isDanish}
              setIsDanish={setIsDanish}
            />
            <main className="content">
              <Box display="flex" flexBasis="100%">
                <Routes>
                  <Route path="/" element={<Home isDanish={isDanish} />} />
                  <Route
                    path="/create"
                    element={<Create isDanish={isDanish} />}
                  />
                  <Route path="/find" element={<Find isDanish={isDanish} />} />
                  <Route
                    path="/rules"
                    element={<Rules isDanish={isDanish} />}
                  />
                </Routes>
              </Box>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
