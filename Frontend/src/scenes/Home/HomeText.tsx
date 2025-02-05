import { Box, Typography, IconButton } from "@mui/material";
import {
  translateCreate,
  translateFind,
  translateHomeCreate,
  translateHomeFind,
  translateHomeRules,
  translateRules,
} from "../../utils/lang/Home/langHomeText";
import { useMediaQuery } from "usehooks-ts";
import {
  CasinoOutlined,
  PeopleOutlined,
  HelpOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { base } from "../../utils/hostSubDirectory";

interface Props {
  isDanish: boolean;
}

const HomeText = ({ isDanish }: Props) => {
  const queryMatches = useMediaQuery("only screen and (min-width: 600px)");

  function doCheck(queryMatches: boolean) {
    if (queryMatches) {
      return "18px";
    } else {
      return "14px";
    }
  }

  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column">
      <Typography
        fontSize={doCheck(queryMatches)}
        fontWeight="bold"
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        sx={{ display: "flex", justifyContent: "center" }}
        children={translateHomeCreate(isDanish)}
      />
      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() => navigate(base + "/create")}
          sx={{
            maxWidth: "max-content",
          }}
        >
          <CasinoOutlined />
          {translateCreate(isDanish)}
        </IconButton>
      </Box>
      <Box paddingTop="10px" />

      <Typography
        fontSize={doCheck(queryMatches)}
        fontWeight="bold"
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        sx={{ display: "flex", justifyContent: "center" }}
        children={translateHomeFind(isDanish)}
      />
      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() => navigate(base + "/find")}
          sx={{
            maxWidth: "max-content",
          }}
        >
          <PeopleOutlined />
          {translateFind(isDanish)}
        </IconButton>
      </Box>
      <Box paddingTop="10px" />

      <Typography
        fontSize={doCheck(queryMatches)}
        fontWeight="bold"
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        sx={{ display: "flex", justifyContent: "center" }}
        children={translateHomeRules(isDanish)}
      />
      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() => navigate(base + "/rules")}
          sx={{
            maxWidth: "max-content",
          }}
        >
          <HelpOutlined />
          {translateRules(isDanish)}
        </IconButton>
      </Box>
      <Box paddingTop="10px" />
    </Box>
  );
};

export default HomeText;
