import { Tooltip } from "antd";
import { useFullscreen } from "../../hooks/useFullscreen";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

function Fullscreen() {
  const [isFullscreen, toggleFullscreen] = useFullscreen();

  return (
    <Tooltip title={isFullscreen ? "退出全屏" : "全屏"}>
      {isFullscreen ? (
        <FullscreenExitOutlined
          className="text-lg"
          onClick={toggleFullscreen}
        />
      ) : (
        <FullscreenOutlined className="text-lg" onClick={toggleFullscreen} />
      )}
    </Tooltip>
  );
}

export default Fullscreen;
