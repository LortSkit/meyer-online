import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import { tokens } from "../../theme";
import { translateCreate } from "../../utils/lang/Create/langCreateHeading";

interface Props {
  isDanish: boolean;
}

const CreateHeading = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" justifyContent="center">
      <Typography
        variant="h1"
        color={colors.blueAccent[100]}
        fontWeight="bold"
        children={translateCreate(isDanish)}
      />
    </Box>
  );
};

export default CreateHeading;
