import { SideMenu } from "../utils/types";

export const stock: SideMenu = {
  label: "库存",
  key: "/stock",
  children: [
    {
      label: "列表",
      key: "/stock/list",
    },
    {
      label: "操作",
      key: "/stock/ops",
    },
    {
      label: "记录",
      key: "/stock/log",
    },
  ],
};
