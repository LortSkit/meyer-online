import { Box, InputBase, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { CasinoOutlined } from "@mui/icons-material";
import { Outlet } from "react-router-dom";

interface Props {
  isDanish: boolean;
  setIsDanish: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home = ({ isDanish, setIsDanish }: Props) => {
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
          >
            Meyer
          </Typography>
        </Box>
        <CasinoOutlined sx={{ display: "flex" }} />
      </Box>

      {/* USER NAME */}
      <Box display="flex" justifyContent="center">
        <Box display="flex" bgcolor={colors.primary[800]}>
          <InputBase
            id="username-bar"
            sx={{
              ml: 2,
              mr: -5,
              color: colors.grey[400],
            }}
            placeholder={isDanish ? "Brugernavn" : "Username"}
          />
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Home;
