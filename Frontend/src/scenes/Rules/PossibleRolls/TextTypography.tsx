import Typography from "@mui/material/Typography";

interface Props {
  children: JSX.Element;
}

const TextTypography = ({ children }: Props) => {
  return (
    <Typography fontSize="18px" fontStyle="normal" textTransform="none">
      {children}
    </Typography>
  );
};

export default TextTypography;
