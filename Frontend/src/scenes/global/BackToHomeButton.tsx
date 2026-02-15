import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Home } from "@mui/icons-material";
import { translateHome } from "../../utils/lang/lang404";
import { base } from "../../utils/hostSubDirectory";
import { useNavigate } from "react-router-dom";

interface Props {
  isDanish: boolean;
}

const BackToHomeButton = ({ isDanish }: Props) => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          navigate(base + "/");
        }}
      >
        <Home />
        {translateHome(isDanish)}
      </Button>
    </Box>
  );
};

export default BackToHomeButton;
