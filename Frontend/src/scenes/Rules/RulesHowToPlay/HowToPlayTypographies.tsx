import { Typography } from "@mui/material";

interface PropsFixedFontSize {
  children: React.ReactNode | string;
}

export const HowToPlayHeading = ({ children }: PropsFixedFontSize) => {
  return (
    <Typography
      variant="h2"
      fontStyle="normal"
      textTransform="none"
      style={{
        wordBreak: "break-word",
        textAlign: "center",
      }}
      sx={{ display: "flex", justifyContent: "center" }}
      children={children}
    />
  );
};

export const HowToPlayHook = ({ children }: PropsFixedFontSize) => {
  return (
    <Typography
      variant="h3"
      fontStyle="normal"
      textTransform="none"
      style={{
        wordBreak: "break-word",
        textAlign: "center",
      }}
      sx={{ display: "flex", justifyContent: "center" }}
      children={children}
    />
  );
};

export const HowToPlaySmallText = ({ children }: PropsFixedFontSize) => {
  return (
    <Typography
      fontSize="12px"
      fontStyle="normal"
      textTransform="none"
      style={{
        wordBreak: "break-word",
        textAlign: "center",
      }}
      sx={{ display: "flex", justifyContent: "center" }}
      children={children}
    />
  );
};

interface PropsText {
  children: React.ReactNode;
  fontSize: number;
}

export const HowToPlayText = ({ children, fontSize }: PropsText) => {
  return (
    <Typography
      fontSize={`${fontSize}px`}
      fontStyle="normal"
      textTransform="none"
      children={children}
    />
  );
};

export const HowToPlayRoll = ({ children, fontSize }: PropsText) => {
  return (
    <Typography
      fontSize={`${fontSize}px`}
      fontStyle="normal"
      textTransform="none"
      display="flex"
      flexDirection="column"
      children={children}
      style={{
        wordBreak: "break-word",
        textAlign: "center",
      }}
      component="span"
    />
  );
};
