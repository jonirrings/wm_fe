import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import { RootState, useAppDispatch } from "../../stores";
import { setMaximize } from "../../stores/public";

export default function () {
  const dispatch = useAppDispatch();
  const isMaximize = useSelector((state: RootState) => state.public.isMaximize);

  /** 点击最大化/最小化 */
  const onClick = useCallback(() => {
    dispatch(setMaximize(!isMaximize));
  }, [isMaximize]);
  const clazz = "text-lg cursor-pointer";

  return (
    <Tooltip
      placement={"leftTop"}
      title={isMaximize ? "还原内容区域" : "放大内容区域"}
    >
      {isMaximize ? (
        <CompressOutlined className={clazz} onClick={onClick} />
      ) : (
        <ExpandOutlined className={clazz} onClick={onClick} />
      )}
    </Tooltip>
  );
}
