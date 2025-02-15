import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import RadioButtonCheckedOutlined from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUnCheckedOutlined from "@mui/icons-material/RadioButtonUnCheckedOutlined";
import useTheme from "@mui/material/styles/useTheme";
import { tokens } from "../../theme";
import Typography from "@mui/material/Typography";
import {
  translateCase1,
  translateCase2,
  translateCase3,
  translateWhen,
} from "../../utils/lang/components/game/langHealthRollRuleSet";

interface Props {
  isDanish: boolean;
  chosenRuleSet: number;
  setChosenRuleSet:
    | React.Dispatch<React.SetStateAction<number>>
    | ((selectedRuleSet: number) => void);
}

const SetHealthRollRuleSet = ({
  isDanish,
  chosenRuleSet,
  setChosenRuleSet,
}: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const CheckIcon = (isChosen: boolean) => {
    if (isChosen) {
      return <RadioButtonCheckedOutlined />;
    } else {
      return <RadioButtonUnCheckedOutlined />;
    }
  };

  return (
    <Box minWidth="360px">
      <Box display="flex" justifyContent="space-between">
        {/* 1 */}
        <Typography
          fontSize="16px"
          fontStyle="normal"
          textTransform="none"
          style={{
            wordBreak: "break-word",
            textAlign: "center",
          }}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            maxWidth: "144px",
          }}
          children={translateWhen(isDanish)}
        />
        <Box display="flex" justifyContent="flex-end" flexDirection="column">
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            style={{
              wordBreak: "break-word",
              textAlign: "center",
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: "72px",
            }}
            children={translateCase1(isDanish)}
          />
          <IconButton
            sx={{ display: "flex", justifyContent: "center" }}
            style={{ color: colors.blackAccent[100] }}
            disabled={chosenRuleSet === 0}
            onClick={() => setChosenRuleSet(0)}
          >
            {CheckIcon(chosenRuleSet === 0)}
          </IconButton>
        </Box>

        {/* 2 */}
        <Box display="flex" justifyContent="flex-end" flexDirection="column">
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            style={{
              wordBreak: "break-word",
              textAlign: "center",
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: "72px",
            }}
            children={translateCase2(isDanish)}
          />
          <IconButton
            sx={{ display: "flex", justifyContent: "center" }}
            style={{ color: colors.blackAccent[100] }}
            disabled={chosenRuleSet === 1}
            onClick={() => setChosenRuleSet(1)}
          >
            {CheckIcon(chosenRuleSet === 1)}
          </IconButton>
        </Box>

        {/* 3 */}
        <Box display="flex" justifyContent="flex-end" flexDirection="column">
          <Typography
            fontSize="16px"
            fontStyle="normal"
            textTransform="none"
            style={{
              wordBreak: "break-word",
              textAlign: "center",
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: "72px",
            }}
            children={translateCase3(isDanish)}
          />
          <IconButton
            sx={{ display: "flex", justifyContent: "center" }}
            style={{ color: colors.blackAccent[100] }}
            disabled={chosenRuleSet === 2}
            onClick={() => setChosenRuleSet(2)}
          >
            {CheckIcon(chosenRuleSet === 2)}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SetHealthRollRuleSet;
