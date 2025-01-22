//Stolen from https://mui.com/material-ui/react-progress/?srsltid=AfmBOop-aYsBwk9RJ6Qfs-9WiPhaCpEEeKwfrQD7FW7k_J3btPbKeJ7i#circular-with-label

import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function CircularProgressWithLabel(
  props: CircularProgressProps & {
    value: number;
    maxvalue: number;
    overridecolor: string;
    ringSize: number;
  }
) {
  return (
    <Box display="flex" justifyContent="flex-end">
      <CircularProgress
        variant="determinate"
        size={`${props.ringSize * 1.5}px`}
        sx={{
          color: props.overridecolor,
          display: "flex",
          position: "absolute",
          paddingTop: `${props.ringSize * 0.1}px`,
        }}
        {...props}
      />
      <Typography
        fontSize={`${props.ringSize}px`}
        paddingRight={`${props.ringSize * 0.44}px`}
      >
        {props.maxvalue + 1 - Math.round((props.value * props.maxvalue) / 100)}
      </Typography>
    </Box>
  );
}

export default function CircularWithValueLabel(props: {
  value: number;
  maxvalue: number;
  overridecolor: string;
  ringSize: number;
}) {
  return (
    <CircularProgressWithLabel
      value={
        ((props.maxvalue - props.value) / props.maxvalue) * 100 +
        100 / props.maxvalue
      }
      maxvalue={props.maxvalue}
      overridecolor={props.overridecolor}
      ringSize={props.ringSize}
    />
  );
}
