import { Typography } from "@mui/material";

interface Props {
  children: JSX.Element;
}

const RollTypography = ({ children }: Props) => {
  return (
    <Typography
      fontSize="18px"
      fontStyle="normal"
      textTransform="none"
      component="span"
    >
      {children}
    </Typography>
  );
};

export default RollTypography;
