import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { translateCreator } from "../../../utils/lang/langUser";

interface Props {
  isDanish: boolean;
  img: string; //path
}

const User = ({ isDanish, img }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          width="100px"
          height="100px"
          src={img}
          style={{ cursor: "pointer", borderRadius: "50%" }}
        />
      </Box>
      <Box textAlign="center">
        <Typography
          variant="h2"
          color={colors.blueAccent[100]}
          fontWeight="bold"
          sx={{ m: "10px 0 0 0" }}
        >
          Alexander Laukamp
        </Typography>
        <Typography
          variant="h5"
          color={colors.blackAccent[100]}
          children={translateCreator(isDanish)}
        />
      </Box>
    </Box>
  );
};

export default User;
