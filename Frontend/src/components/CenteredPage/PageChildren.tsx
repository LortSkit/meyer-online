import { Box } from "@mui/material";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  widthPercentage?: number;
}

export const LeftChild = (props?: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={props?.widthPercentage ? `${props.widthPercentage}%` : "31%"}
    >
      {props?.children}
    </Box>
  );
};

export const MiddleChild = (props?: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={props?.widthPercentage ? `${props.widthPercentage}%` : "38%"}
      paddingBottom="50px"
    >
      {props?.children}
    </Box>
  );
};

export const RightChild = (props?: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={props?.widthPercentage ? `${props.widthPercentage}%` : "31%"}
    >
      {props?.children}
    </Box>
  );
};
