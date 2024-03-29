export const TOKEN = "token";
export const EMPTY_VALUE: string = "-";
export const apiPrefix: string = "/api/v1";
export const sseUrl: string = "/sse";
export const wssUrl: string = `${location.protocol === "http:" ? "ws" : "wss"}://${location.host}/wss`;
export const errCodeMap: Map<number, string> = new Map([
  [403, "服务器理解请求客户端的请求，但是拒绝执行此请求"],
  [404, "所请求的资源无法找到"],
  [405, "目标资源不支持该方法"],
  [408, "（请求超时） 服务器等候请求时发生超时"],
  [422, "由于语义错误而无法遵循"],
  [429, "请求过多"],
  [500, "内部服务错误"],
  [501, "未实现"],
  [502, "网关错误"],
  [503, "服务不可用"],
  [504, "网关超时"],
  [505, "HTTP版本不支持"],
  [506, "内部配置错误：请求透明内容协商导致循环引用"],
  [507, "内部配置错误：所选的变体资源不可用"],
  [508, "检测到无限循环"],
  [510, "请求需要扩展"],
  [511, "所请求网络需要身份验证"],
]);
