import { Box } from "@mui/material";

interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export const LeftChild = (props?: Props) => {
  return (
    <Box display="flex" minWidth="21%">
      {props?.children}
    </Box>
  );
};

export const MiddleChild = (props?: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      maxWidth="48%"
    >
      {props?.children}
    </Box>
  );
};

export const RightChild = (props?: Props) => {
  return (
    <Box display="flex" minWidth="21%">
      {props?.children}
    </Box>
  );
};
