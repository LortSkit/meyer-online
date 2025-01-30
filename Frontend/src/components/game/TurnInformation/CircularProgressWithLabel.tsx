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
    trueValue: number;
  }
) {
  const passingProps = { ...props, ringSize: undefined, trueValue: undefined };
  delete passingProps.ringSize;
  delete passingProps.trueValue;

  const valueDigitsPaddingMultiplier = props.trueValue >= 10 ? 0.5 : 1;

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
        {...passingProps}
      />
      <Typography
        fontSize={`${props.ringSize}px`}
        paddingRight={`${
          props.ringSize * valueDigitsPaddingMultiplier * 0.44
        }px`}
      >
        {Math.round((props.value * props.maxvalue) / 100) + 1}
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
        ((props.maxvalue - 1 - (props.maxvalue - props.value)) /
          props.maxvalue) *
        100
      }
      maxvalue={props.maxvalue}
      overridecolor={props.overridecolor}
      ringSize={props.ringSize}
      trueValue={props.value}
    />
  );
}
