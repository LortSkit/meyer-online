import Box from "@mui/material/Box";
import { version as MeyerVersion } from "../../../package.json";

const Footer = () => {
  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box display="flex" justifyContent="center">
        Meyer version {MeyerVersion}
      </Box>
      <Box display="flex" justifyContent="center">
        Alexander Laukamp, 2025
      </Box>
    </Box>
  );
};

export default Footer;
