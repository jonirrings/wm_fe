import { Tabs, TabsProps } from "antd";
import ItemTab from "./ItemTab.tsx";
import ShelfTab from "./ShelfTab.tsx";
import ConvertTab from "./ConvertTab.tsx";

function ItemOps() {
  const items: TabsProps["items"] = [
    { key: "by_item", label: "物品", children: <ItemTab /> },
    { key: "by_shelf", label: "货架", children: <ShelfTab /> },
    { key: "convert", label: "转换", children: <ConvertTab /> },
  ];
  return <Tabs items={items} />;
}

export default ItemOps;
