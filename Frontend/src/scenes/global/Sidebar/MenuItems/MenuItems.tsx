import Box from "@mui/material/Box";
import CasinoOutlined from "@mui/icons-material/CasinoOutlined";
import HelpOutlined from "@mui/icons-material/HelpOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import Item from "./Item";
import {
  translateCreate,
  translateFind,
  translateHome,
  translateRules,
} from "../../../../utils/lang/langMenuItems";
import { base } from "../../../../utils/hostSubDirectory";

interface Props {
  isDanish: boolean;
  paddingLeft: string | undefined;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const MenuItems = ({ isDanish, paddingLeft, selected, setSelected }: Props) => {
  return (
    <Box>
      <Box paddingLeft={paddingLeft}>
        <Item
          title={translateHome(isDanish)}
          to={base + "/"}
          icon={<HomeOutlined />}
          selected={selected}
          setSelected={setSelected}
        ></Item>
      </Box>
      <Box paddingLeft={paddingLeft}>
        <Item
          title={translateCreate(isDanish)}
          to={base + "/create"}
          icon={<CasinoOutlined />}
          selected={selected}
          setSelected={setSelected}
        ></Item>
      </Box>
      <Box paddingLeft={paddingLeft}>
        <Item
          title={translateFind(isDanish)}
          to={base + "/find"}
          icon={<PeopleOutlined />}
          selected={selected}
          setSelected={setSelected}
        ></Item>
      </Box>
      <Box paddingLeft={paddingLeft}>
        <Item
          title={translateRules(isDanish)}
          to={base + "/rules"}
          icon={<HelpOutlined />}
          selected={selected}
          setSelected={setSelected}
        ></Item>
      </Box>
    </Box>
  );
};

export default MenuItems;
