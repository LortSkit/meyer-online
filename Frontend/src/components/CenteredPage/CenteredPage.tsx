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
        ) : (
          <LeftChild
            widthPercentage={
              props.leftWidthPercentage ? props.leftWidthPercentage : undefined
            }
          />
        )}

        {props.middleChild ? (
          props.middleChild
        ) : (
          <MiddleChild
            widthPercentage={
              props.middleWidthPercentage
                ? props.middleWidthPercentage
                : undefined
            }
          />
        )}

        {props.rightChild ? (
          props.rightChild
        ) : (
          <RightChild
            widthPercentage={
              props.rightWidthPercentage
                ? props.rightWidthPercentage
                : undefined
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default CenteredPage;
