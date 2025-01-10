import { Box } from "@mui/material";
import { TurnInfo } from "../../../utils/gameTypes";
import { translateTurnInfo } from "../../../utils/lang/Create/InGame/langTurnInformation";

interface Props {
  isDanish: boolean;
  turnInformation: TurnInfo[];
}

const TurnInformation = ({ isDanish, turnInformation }: Props) => {
  return turnInformation.map((value: TurnInfo, index: number) => (
    <Box
      key={index}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box display="flex" justifyContent="center">
        {translateTurnInfo(isDanish, value)}
      </Box>
    </Box>
  ));
};

export default TurnInformation;
