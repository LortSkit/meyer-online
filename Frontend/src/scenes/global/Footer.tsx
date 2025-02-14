import Box from "@mui/material/Box";
import { version as MeyerVersion } from "../../../package.json";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import IconButton from "@mui/material/IconButton";

const Footer = () => {
  return (
    <Box display="flex" justifyContent="flex-end" flexDirection="column">
      {/* MEYER VERSION */}
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center" flexDirection="column">
          Meyer version {MeyerVersion}
        </Box>
        <Box paddingLeft="2px" />
        <Box display="flex" justifyContent="center" flexDirection="column">
          <IconButton
            sx={{ width: "20px", height: "20px" }}
            onClick={() =>
              window.open("https://github.com/LortSkit/meyer-online", "_blank")
            }
          >
            <GitHub sx={{ width: "20px" }} />
          </IconButton>
        </Box>
      </Box>

      {/* CREATOR NAME */}
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="center" flexDirection="column">
          Alexander Laukamp, 2025
        </Box>
        <Box paddingLeft="2px" />
        <Box display="flex" justifyContent="center" flexDirection="column">
          <IconButton
            sx={{ width: "20px", height: "20px" }}
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/alexander-laukamp-433620255/",
                "_blank"
              )
            }
          >
            <LinkedIn sx={{ width: "20px" }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
