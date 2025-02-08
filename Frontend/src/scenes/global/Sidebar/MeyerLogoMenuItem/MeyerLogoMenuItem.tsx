import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import { MenuItem } from "react-pro-sidebar";
import MeyerLogo from "./MeyerLogo";

interface Props {
  isSidebarVisible: boolean;
  setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MeyerLogoMenuItem = ({
  isSidebarVisible: isVisible,
  setIsSidebarVisible: setIsVisible,
}: Props) => {
  return (
    <MenuItem
      onClick={() => {
        localStorage.setItem("isCollapsed", String(!isVisible));
        setIsVisible(!isVisible);
      }}
      icon={<MenuOutlined />}
      style={{
        margin: "3.5px 0 20px 0",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        //ml="15px"
      >
        <IconButton onClick={() => setIsVisible(!isVisible)}>
          <MeyerLogo />
        </IconButton>
      </Box>
    </MenuItem>
  );
};

export default MeyerLogoMenuItem;
