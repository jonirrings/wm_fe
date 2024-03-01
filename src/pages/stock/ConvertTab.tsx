import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  SelectProps,
  Space,
} from "antd";
import { useReadItemsQuery } from "../../services/item";
import { useReadShelvesQuery } from "../../services/shelf";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const initialValues = {
  from: [{}],
  into: [{}],
};

function ConvertTab() {
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
    <Form form={formRef} onFinish={onFinish} initialValues={initialValues}>
      <Row gutter={8}>
        <Col span={12}>
          <Form.List
            name="from"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 2) {
                    return Promise.reject(new Error("至少一种材料"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((f, idx) => (
                  <Space.Compact key={f.key}>
                    <Form.Item
                      noStyle
                      name={[f.name, "item_id"]}
                      rules={[{ required: true, message: "材料为必选" }]}
                    >
                      <Select
                        loading={itemLoading}
                        options={itemOpts}
                        showSearch
                        placeholder="材料"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[f.name, "count"]}
                      rules={[{ required: true, message: "取出数量必填" }]}
                    >
                      <InputNumber
                        precision={0}
                        min={1}
                        style={{ width: "50%" }}
                        placeholder="取出数量"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[f.name, "shelf_id"]}
                      rules={[{ required: true, message: "来源货架为必选" }]}
                    >
                      <Select
                        loading={shelfLoading}
                        options={shelfOpts}
                        placeholder="来源货架"
                        showSearch
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<MinusOutlined />}
                        onClick={() => remove(idx)}
                      />
                    ) : null}
                  </Space.Compact>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                    icon={<PlusOutlined />}
                  >
                    添加材料
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
        <Col span={12}>
          <Form.List
            name="into"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 2) {
                    return Promise.reject(new Error("至少一种产物"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((f, idx) => (
                  <Space.Compact key={f.key}>
                    <Form.Item
                      noStyle
                      name={[f.name, "item_id"]}
                      rules={[{ required: true, message: "产物为必选" }]}
                    >
                      <Select
                        loading={itemLoading}
                        options={itemOpts}
                        showSearch
                        placeholder="产物"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name={[f.name, "count"]}
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
                      noStyle
                      name={[f.name, "shelf_id"]}
                      rules={[{ required: true, message: "目标货架为必选" }]}
                    >
                      <Select
                        loading={shelfLoading}
                        options={shelfOpts}
                        placeholder="货架"
                        showSearch
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<MinusOutlined />}
                        onClick={() => remove(idx)}
                      />
                    ) : null}
                  </Space.Compact>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "100%" }}
                    icon={<PlusOutlined />}
                  >
                    添加产物
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </Form>
  );
}

export default ConvertTab;
