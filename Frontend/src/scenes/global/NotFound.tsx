import Box from "@mui/material/Box";
import { MiddleChild } from "../../components/CenteredPage/PageChildren";
import BackToHomeButton from "./BackToHomeButton";
import Typography from "@mui/material/Typography";
import {
  translate404Explanation,
  translateNotFound,
} from "../../utils/lang/lang404";

interface Props {
  isDanish: boolean;
}

const NotFound = ({ isDanish }: Props) => {
  return (
    <MiddleChild widthPercentage={100}>
      <Typography
        display={"flex"}
        variant="h3"
        fontSize="50px"
        fontStyle="normal"
        textTransform="none"
        children={"404 - " + translateNotFound(isDanish)}
        justifyContent={"center"}
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
      />
      <Typography
        display={"flex"}
        fontSize="16px"
        fontStyle="normal"
        textTransform="none"
        children={translate404Explanation(isDanish)}
        justifyContent={"center"}
        style={{
          wordBreak: "break-word",
          textAlign: "center",
        }}
        padding={"20px"}
      />
      <Box p={2} />
      <BackToHomeButton isDanish={isDanish} />
    </MiddleChild>
  );
};

export default NotFound;
