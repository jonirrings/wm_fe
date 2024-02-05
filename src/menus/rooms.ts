import { SideMenu } from "../utils/types";

export const rooms: SideMenu = {
  label: "房间",
  key: "/rooms",
  children: [
    {
      label: "列表",
      key: "/rooms/list",
    },
    {
      label: "记录",
      key: "/rooms/log",
    },
  ],
};
