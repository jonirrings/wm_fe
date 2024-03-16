import { useSelector } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../../stores";
import { setCollapsed } from "../../stores/public";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export default function () {
  const dispatch: AppDispatch = useAppDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.public.isCollapsed,
  );
  return (
    <div
      className="text-lg cursor-pointer mr-20px"
      onClick={() => dispatch(setCollapsed(!isCollapsed))}
    >
      {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  );
}
