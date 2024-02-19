import { CheckboxOptionType, Form, Radio } from "antd";

export type OpsAction = "withdraw" | "deposit" | "transfer" | "convert";
const actions: CheckboxOptionType<OpsAction>[] = [
  {
    label: "存",
    value: "deposit",
    title: "存入物品",
  },
  {
    label: "取",
    value: "withdraw",
    title: "取出物品",
  },
  {
    label: "转移",
    value: "transfer",
    title: "转移物品",
  },
];

export const initialAction = {
  action: "deposit",
};

export function renderAction() {
  return (
    <Form.Item name="action" label="操作">
      <Radio.Group options={actions} buttonStyle="solid" />
    </Form.Item>
  );
}
