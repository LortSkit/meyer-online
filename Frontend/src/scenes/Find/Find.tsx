import { Box, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { CasinoOutlined } from "@mui/icons-material";
import { Outlet } from "react-router-dom";

interface Props {
  isDanish: boolean;
}

const Find = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" flexBasis="100%" flexDirection="column">
      {/* HEADING */}
      <Box display="flex" justifyContent="center" p={2}>
        <CasinoOutlined sx={{ display: "flex" }} />
        <Box display="flex" justifyContent="center">
          <Typography
            variant="h1"
            color={colors.blueAccent[100]}
            fontWeight="bold"
            children={isDanish ? "Find spil" : "Find games"}
          />
        </Box>
        <CasinoOutlined sx={{ display: "flex" }} />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Find;
