import { useState, useRef } from "react";
import { ColorModeContext, useMode } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import SidebarComp from "./scenes/global/SidebarComp";
import { Route, Routes } from "react-router-dom";
import Test from "./scenes/Lobby/Test";
import "./App.css";

const App = () => {
  const [theme, colorMode] = useMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(Box);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SidebarComp
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          >
            <main className="content">
              <Topbar />
              <Box position="fixed" marginTop="70px" marginLeft="20px">
                <Routes>
                  <Route path="/" element={<Test />} />
                </Routes>
              </Box>
            </main>
          </SidebarComp>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

// <div>
//   {alertVisible && (
//     <Alert onClose={() => setAlertVisible(false)}>My alert</Alert>
//   )}
//   <Button
//     color="danger"
//     onClick={() => {
//       setAlertVisible(true);
//     }}
//   >
//     My Button
//   </Button>
// </div>
