import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import SidebarComp from "./scenes/global/SidebarComp";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./scenes/Home/Home";
import Create from "./scenes/Create/Create";
import Find from "./scenes/Find/Find";
import Rules from "./scenes/Rules/Rules";

const App = () => {
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDanish, setIsDanish] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SidebarComp
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isDanish={isDanish}
          >
            <main className="content">
              <Topbar isDanish={isDanish} setIsDanish={setIsDanish}>
                <Box display="flex" flexBasis="100%">
                  <Routes>
                    <Route path="/" element={<Home isDanish={isDanish} />} />
                    <Route
                      path="/create"
                      element={<Create isDanish={isDanish} />}
                    />
                    <Route
                      path="/find"
                      element={<Find isDanish={isDanish} />}
                    />
                    <Route
                      path="/rules"
                      element={<Rules isDanish={isDanish} />}
                    />
                  </Routes>
                </Box>
              </Topbar>
            </main>
          </SidebarComp>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
