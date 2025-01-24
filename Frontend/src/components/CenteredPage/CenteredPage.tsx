import { Box } from "@mui/material";
import { LeftChild, MiddleChild, RightChild } from "./PageChildren";

interface Props {
  leftChild?: JSX.Element; //Expecting output of LeftChild
  middleChild?: JSX.Element; //Expecting output of MiddleChild
  rightChild?: JSX.Element; //Expecting output of RightChild
  leftWidthPercentage?: number;
  middleWidthPercentage?: number;
  rightWidthPercentage?: number;
}

const CenteredPage = (props: Props) => {
  return (
    <Box display="flex" justifyContent="center" flexBasis="100%">
      <Box display="flex" justifyContent="space-between" flexBasis="100%">
        {props.leftChild ? (
          props.leftChild
        ) : (props.leftWidthPercentage !== undefined &&
            !(props.leftWidthPercentage <= 0)) ||
          props.leftWidthPercentage === undefined ? (
          <LeftChild
            widthPercentage={
              props.leftWidthPercentage ? props.leftWidthPercentage : undefined
            }
          />
        ) : undefined}

        {props.middleChild ? (
          props.middleChild
        ) : (props.middleWidthPercentage !== undefined &&
            !(props.middleWidthPercentage <= 0)) ||
          !props.middleWidthPercentage ? (
          <MiddleChild
            widthPercentage={
              props.middleWidthPercentage
                ? props.middleWidthPercentage
                : undefined
            }
          />
        ) : undefined}

        {props.rightChild ? (
          props.rightChild
        ) : (props.rightWidthPercentage !== undefined &&
            !(props.rightWidthPercentage <= 0)) ||
          props.rightWidthPercentage === undefined ? (
          <RightChild
            widthPercentage={
              props.rightWidthPercentage
                ? props.rightWidthPercentage
                : undefined
            }
          />
        ) : undefined}
      </Box>
    </Box>
  );
};

export default CenteredPage;
