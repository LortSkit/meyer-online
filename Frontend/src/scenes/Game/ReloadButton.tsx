import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import { translateReload } from "../../utils/lang/Game/langReloadButton";

interface Props {
  isDanish: boolean;
}

const ReloadButton = ({ isDanish }: Props) => {
  return (
    <Box display="flex" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setTimeout(function () {
            window.location.reload();
          });
        }}
      >
        <CachedOutlinedIcon />
        {translateReload(isDanish)}
      </Button>
    </Box>
  );
};

export default ReloadButton;
