import { Menu, MenuProps } from "antd";
import { defaultMenus } from "../../menus";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState, useAppDispatch } from "../../stores";
import { useEffect } from "react";
import { setOpenKeys, setSelectedKeys } from "../../stores/public";
import { getOpenMenuByPath } from "../../menus/utils/helper";
import { useSelector } from "react-redux";

export default function LayoutMenus() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch: AppDispatch = useAppDispatch();
  const items: MenuProps["items"] = defaultMenus;
  const selectedKeys = useSelector(
    (state: RootState) => state.public.selectedKeys,
  );
  const openKeys = useSelector((state: RootState) => state.public.openKeys);

  useEffect(() => {
    const newOpenKey = getOpenMenuByPath(pathname);
    dispatch(setOpenKeys(newOpenKey));
    dispatch(setSelectedKeys([pathname]));
  }, [pathname]);

  return (
    <Menu
      items={items}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={(openKeys) => dispatch(setOpenKeys(openKeys))}
      onClick={(info) => navigate(info.key)}
    />
  );
}
