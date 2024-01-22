import { AppDispatch, useAppDispatch } from '../stores';
import { setFullscreen } from "../stores/public";
import { useCommonStore } from "./useCommonStore";

export function useFullscreen() {
  const dispatch: AppDispatch = useAppDispatch();
  const { isFullscreen } = useCommonStore();

  /** 切换全屏 */
  const toggleFullscreen = () => {
    // 全屏
    if(!isFullscreen && document.documentElement?.requestFullscreen) {
      document.documentElement.requestFullscreen();
      dispatch(setFullscreen(true));
      return true;
    }
    // 退出全屏
    if (isFullscreen && document?.exitFullscreen) {
      document.exitFullscreen();
      dispatch(setFullscreen(false));
      return true;
    }
  };

  return [isFullscreen, toggleFullscreen] as const;
}
