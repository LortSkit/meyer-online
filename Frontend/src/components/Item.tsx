import { tokens } from "../theme";
import { Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  to: string;
  icon: ReactNode;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const Item = ({ title, to, icon, selected, setSelected }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <MenuItem
        active={selected === title}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(title)}
        icon={icon}
        component={"span"}
      >
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

export default Item;
