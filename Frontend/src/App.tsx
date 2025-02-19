import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { createContext, useRef, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
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
import Game from "./scenes/Game/Game";
import { isInLobby } from "./utils/appUtils";
import { useSwipeable } from "react-swipeable";
import { base } from "./utils/hostSubDirectory";
import Footer from "./scenes/global/Footer";
import CreateLocal from "./scenes/Create/CreateLocal/CreateLocal";
import CreateOnline from "./scenes/Create/CreateOnline/CreateOnline";

const App = () => {
  const [theme, colorMode] = useMode();

  const initIsCollapsed = localStorage.getItem("isCollapsed") === "true";

  const getIsDanish = localStorage.getItem("isDanish");
  const initIsDanish =
    getIsDanish != null ? getIsDanish === "true" : navigator.language === "da";

  const [isCollapsed, setIsCollapsed] = useState(initIsCollapsed);
  const [isVisible, setIsVisible] = useState(false);
  const [isDanish, setIsDanish] = useState(initIsDanish);
  const [searchLobbyName, setSearchLobbyName] = useState("");
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
          <div className="rest">
            <Topbar
              isDanish={isDanish}
              pathname={pathname}
              searchLobbyName={searchLobbyName}
              setIsDanish={setIsDanish}
              setIsVisible={setIsVisible}
              setSearchLobbyName={setSearchLobbyName}
            />
            <main className="content">
              <Routes>
                <Route
                  path={base + "/"}
                  element={<Home isDanish={isDanish} />}
                />
                <Route
                  path={base + "/create"}
                  element={<Create isDanish={isDanish} />}
                />
                <Route
                  path={base + "/create/local"}
                  element={<CreateLocal isDanish={isDanish} />}
                />
                <Route
                  path={base + "/create/online"}
                  element={
                    <SocketContextComponent isDanish={isDanish}>
                      <CreateOnline isDanish={isDanish} />
                    </SocketContextComponent>
                  }
                />
                <Route
                  path={base + "/find"}
                  element={
                    <SocketContextComponent isDanish={isDanish}>
                      <Find
                        isDanish={isDanish}
                        searchLobbyName={searchLobbyName}
                        setSearchLobbyName={setSearchLobbyName}
                      />
                    </SocketContextComponent>
                  }
                />
                <Route
                  path={base + "/rules"}
                  element={<Rules isDanish={isDanish} />}
                />
                <Route
                  path={base + "/game/:gameId"}
                  element={
                    <SocketContextComponent isDanish={isDanish}>
                      <Game isDanish={isDanish} />
                    </SocketContextComponent>
                  }
                />
                <Route
                  path={base + "/game"}
                  element={<Navigate to={base + "/game/unknown"} />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
