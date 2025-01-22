import { createContext, useState } from "react";
import { ColorModeContext, tokens, useMode } from "./theme";
import { Box, colors, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import SidebarDesktop from "./scenes/global/Sidebar/SidebarDesktop";
import SidebarMobile from "./scenes/global/Sidebar/SidebarMobile";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./scenes/Home/Home";
import Create from "./scenes/Create/Create";
import Find from "./scenes/Find/Find";
import Rules from "./scenes/Rules/Rules";
import SocketContextComponent from "./contexts/Socket/SocketComponents";
import GameLobby from "./scenes/GameLobby/GameLobby";
import { isInLobby } from "./utils/appUtils";
import { useSwipeable } from "react-swipeable";

const App = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  const initIsCollapsed = localStorage.getItem("isCollapsed") === "true";

  const getIsDanish = localStorage.getItem("isDanish");
  const initIsDanish = getIsDanish != null ? getIsDanish === "true" : true;

  const [isCollapsed, setIsCollapsed] = useState(initIsCollapsed);
  const [isVisible, setIsVisible] = useState(false);
  const [isDanish, setIsDanish] = useState(initIsDanish);
  const handlers = useSwipeable({
    trackMouse: true,
    onSwipedRight: () => setIsVisible(true),
    onSwipedLeft: () => setIsVisible(false),
  });

  createContext(handlers);

  const location = useLocation();
  const { hash, pathname, search } = location;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div {...handlers} className="app">
          {!isInLobby(pathname) && (
            <SidebarDesktop
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isDanish={isDanish}
            />
          )}

          <div className="sidebarMobileWrapper">
            {!isInLobby(pathname) && (
              <SidebarMobile
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                isDanish={isDanish}
              />
            )}
            {!isInLobby(pathname) && isVisible && (
              <div
                className="sidebarMobileOverlay"
                onClick={() => setIsVisible(false)}
              />
            )}
          </div>
          <div {...handlers} className="rest">
            <Topbar
              setIsVisible={setIsVisible}
              isDanish={isDanish}
              setIsDanish={setIsDanish}
              pathname={pathname}
            />
            <main className="content">
              <Box
                display="flex"
                flexBasis="100%"
                height="100%"
                minHeight="80vh"
              >
                <Routes>
                  <Route path="/" element={<Home isDanish={isDanish} />} />
                  <Route
                    path="/create"
                    element={
                      <SocketContextComponent isDanish={isDanish}>
                        <Create isDanish={isDanish} />
                      </SocketContextComponent>
                    }
                  />
                  <Route
                    path="/find"
                    element={
                      <SocketContextComponent isDanish={isDanish}>
                        <Find isDanish={isDanish} />
                      </SocketContextComponent>
                    }
                  />
                  <Route
                    path="/rules"
                    element={<Rules isDanish={isDanish} />}
                  />
                  <Route
                    path="/game/:gameId"
                    element={
                      <SocketContextComponent isDanish={isDanish}>
                        <GameLobby />
                      </SocketContextComponent>
                    }
                  />
                  <Route
                    path="/game"
                    element={<Navigate to="/game/unknown" />}
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
