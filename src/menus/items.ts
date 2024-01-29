import { SideMenu } from "../utils/types.ts";

export const items: SideMenu = {
  label: "物品",
  key: "/items",
  children: [
    {
      label: "列表",
      key: "/items/list",
    },
    {
      label: "记录",
      key: "/items/log",
    },
  ],
};
