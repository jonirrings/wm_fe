import { Menu, MenuProps } from "antd";
import { defaultMenus } from "../menus";
import { useNavigate } from "react-router-dom";

function Menus() {
  const navigate = useNavigate();
  const items: MenuProps["items"] = defaultMenus;
  return (
    <Menu items={items} mode="inline" onClick={(info) => navigate(info.key)} />
  );
}

export default Menus;
