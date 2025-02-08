import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import { tokens } from "../../../theme";

interface Props {
  leftChild: JSX.Element | JSX.Element[]; //Expecting output of LeftChild
  rightChild: JSX.Element; //Expecting output of RightChild
  wrapLeft?: boolean;
}

const RowComponent = (props: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const padding = "10px";
  const space = "2px";

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor={colors.primary[700]}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexBasis="100%"
        padding={padding}
      >
        <Box
          display="flex"
          justifyContent="center"
          flexDirection={props.wrapLeft ? undefined : "column"}
          flexWrap={props.wrapLeft ? "wrap" : undefined}
        >
          {props.leftChild}
        </Box>
      </Box>
      <Box paddingLeft={space} bgcolor={colors.primary[500]} />
      <Box display="flex" flexBasis="100%" padding={padding}>
        {props.rightChild}
      </Box>
    </Box>
  );
};

export default RowComponent;
