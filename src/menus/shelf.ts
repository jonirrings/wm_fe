import { SideMenu } from "../utils/types.ts";

export const shelf: SideMenu = {
  label: "货架",
  key: "/shelf",
  children: [
    {
      label: "列表",
      key: "/shelf/list",
    },
    {
      label: "记录",
      key: "/shelf/log",
    },
  ],
};
