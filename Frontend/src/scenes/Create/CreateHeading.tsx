import { useTheme, Box, Typography } from "@mui/material";
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
