import { Button, Form, InputNumber, Select, SelectProps, Space } from "antd";
import { useReadItemsQuery } from "../../services/item";
import { initialAction, OpsAction, renderAction } from "./utils";
import { useReadShelvesQuery } from "../../services/shelf";

function ItemTab() {
  const [formRef] = Form.useForm();
  const { data: items, isLoading: itemLoading } = useReadItemsQuery({});
  const { data: shelves, isLoading: shelfLoading } = useReadShelvesQuery({});
  const itemOpts: SelectProps["options"] = items?.data.map((i) => ({
    label: i.name,
    value: i.item_id,
  }));
  const shelfOpts: SelectProps["options"] = shelves?.data.map((i) => ({
    label: i.name,
    value: i.shelf_id,
  }));

  function onFinish(_values: any) {}

  return (
    <Form form={formRef} onFinish={onFinish} initialValues={initialAction}>
      <Form.Item name="item_id" label="物品">
        <Select loading={itemLoading} options={itemOpts} showSearch />
      </Form.Item>
      {renderAction()}
      <Form.Item dependencies={["action"]} noStyle>
        {(inst) => {
          const action: OpsAction = inst.getFieldValue("action");
          switch (action) {
            case "deposit":
            case "withdraw":
              return (
                <Form.Item label={action === "deposit" ? "目标" : "来源"}>
                  <Space.Compact>
                    <Form.Item
                      name="shelf_id"
                      noStyle
                      rules={[{ required: true, message: "货架为必选" }]}
                    >
                      <Select
                        loading={shelfLoading}
                        options={shelfOpts}
                        placeholder="货架"
                        showSearch
                      />
                    </Form.Item>
                    <Form.Item
                      name="count"
                      noStyle
                      rules={[{ required: true, message: "存入数量必填" }]}
                    >
                      <InputNumber
                        precision={0}
                        min={1}
                        style={{ width: "50%" }}
                        placeholder="数量"
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              );
            case "transfer":
              return (
                <>
                  <Form.Item
                    label="数量"
                    name="count"
                    rules={[{ required: true, message: "存入数量必填" }]}
                  >
                    <InputNumber
                      precision={0}
                      min={1}
                      style={{ width: "50%" }}
                      placeholder="数量"
                    />
                  </Form.Item>
                  <Form.Item
                    label="来源"
                    name="shelf_from"
                    rules={[{ required: true, message: "来源货架为必选" }]}
                  >
                    <Select
                      loading={shelfLoading}
                      options={shelfOpts}
                      placeholder="货架"
                      showSearch
                    />
                  </Form.Item>
                  <Form.Item
                    label="目标"
                    name="shelf_to"
                    dependencies={["shelf_from"]}
                    rules={[
                      { required: true, message: "目标货架为必选" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("shelf_from") !== value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("来源与目标货架不能相同"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Select
                      loading={shelfLoading}
                      options={shelfOpts}
                      placeholder="货架"
                      showSearch
                    />
                  </Form.Item>
                </>
              );
            default:
              return "todo";
          }
        }}
      </Form.Item>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </Form>
  );
}

export default ItemTab;
