import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CenteredPage from "../../components/CenteredPage/CenteredPage";
import { useNavigate } from "react-router-dom";
import {
  translateCreateLocal,
  translateCreateNewLocalGame,
  translateCreateNewOnlineGame,
  translateCreateOnline,
} from "../../utils/lang/Create/langCreate";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import CreateHeading from "./CreateHeading";

interface Props {
  isDanish: boolean;
}

const Create = ({ isDanish }: Props) => {
  const navigate = useNavigate();

  const middleChild = (
    <MiddleChild widthPercentage={90}>
      <Box display="flex" flexDirection="column">
        {/* HEADING */}
        <CreateHeading isDanish={isDanish} />

        <Box p={2} />
        {/* LOCAL */}
        <Box display="flex" justifyContent="center">
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            children={translateCreateLocal(isDanish)}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("./local")}
            children={
              <Typography
                fontSize="20px"
                fontStyle="normal"
                textTransform="none"
              >
                {translateCreateNewLocalGame(isDanish)}
              </Typography>
            }
          />
        </Box>

        <Box p={2} />

        {/* ONLINE */}
        <Box display="flex" justifyContent="center">
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            children={translateCreateOnline(isDanish)}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("./online")}
            children={
              <Typography
                fontSize="20px"
                fontStyle="normal"
                textTransform="none"
              >
                {translateCreateNewOnlineGame(isDanish)}
              </Typography>
            }
          />
        </Box>
      </Box>
    </MiddleChild>
  );

  return (
    <CenteredPage
      middleChild={middleChild}
      leftWidthPercentage={5}
      rightWidthPercentage={5}
    />
  );
};

export default Create;
