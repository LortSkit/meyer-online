import { Box } from "@mui/material";
import { LeftChild, RightChild } from "./PageChildren";

interface Props {
  leftChild?: JSX.Element; //Expecting output of LeftChild
  middleChild: JSX.Element; //Expecting output of MiddleChild
  rightChild?: JSX.Element; //Expecting output of RightChild
}

const CenteredPage = (props: Props) => {
  return (
    <Box display="flex" justifyContent="center" flexBasis="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexBasis="100%"
      >
        {props.leftChild ? props.leftChild : <LeftChild />}

        {props.middleChild}

        {props.rightChild ? props.rightChild : <RightChild />}
      </Box>
    </Box>
  );
};

export default CenteredPage;
