//Stolen from https://mui.com/material-ui/react-progress/?srsltid=AfmBOop-aYsBwk9RJ6Qfs-9WiPhaCpEEeKwfrQD7FW7k_J3btPbKeJ7i#circular-with-label

import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CircularProgressWithLabel(
  props: CircularProgressProps & {
    value: number;
    maxvalue: number;
    overridecolor: string;
  }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size="30px"
        sx={{ color: props.overridecolor }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontSize="16px"
          sx={{ color: "text.secondary" }}
        >{`${
          props.maxvalue + 1 - Math.round((props.value * props.maxvalue) / 100)
        }`}</Typography>
      </Box>
    </Box>
  );
}

export default function CircularWithValueLabel(props: {
  value: number;
  maxvalue: number;
  overridecolor: string;
}) {
  return (
    <CircularProgressWithLabel
      value={
        ((props.maxvalue - props.value) / props.maxvalue) * 100 +
        100 / props.maxvalue
      }
      maxvalue={props.maxvalue}
      overridecolor={props.overridecolor}
    />
  );
}
