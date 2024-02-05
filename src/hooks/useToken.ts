import { TOKEN } from "../utils/constants";
import { setRawLocal, getRawLocal, removeLocal } from "../utils/local";

/**
 * token存取方法
 */
export function useToken() {
  /** 获取token */
  const getToken = () => {
    return getRawLocal(TOKEN) || "";
  };

  /**
   * 设置token
   * @param value token值
   */
  const setToken = (value: string) => {
    setRawLocal(TOKEN, value);
  };

  /** 删除token */
  const removeToken = () => {
    removeLocal(TOKEN);
  };

  return [getToken, setToken, removeToken] as const;
}
