import { forwardRef, Ref, useImperativeHandle } from "react";
import { IDType, SFProps, SimpleForm } from "../../utils/types";
import {
  BizItem,
  ItemPayload,
  useCreateItemMutation,
  useUpdateItemMutation,
} from "../../services/item";
import { App, Form, Input } from "antd";
import { handleRTKError } from "../../utils/transformer";

type Props = SFProps<BizItem>;

function ShelfForm(props: Props, ref: Ref<SimpleForm>) {
  const { draft, onSuccess } = props;
  const [formRef] = Form.useForm<ItemPayload>();
  const [create] = useCreateItemMutation();
  const [update] = useUpdateItemMutation();
  const { message } = App.useApp();
  const isEditing = !!draft;
  useImperativeHandle(ref, () => ({
    submit: () => formRef.submit(),
  }));

  function onFinish(values: ItemPayload) {
    let p: Promise<IDType>;
    if (isEditing) {
      p = update({ ...values, id: draft.item_id }).unwrap();
    } else {
      p = create(values).unwrap();
    }
    p.then(onSuccess).catch((err) => handleRTKError(err, message));
  }

  return (
    <Form
      form={formRef}
      initialValues={draft}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        name="name"
        label="名称"
        rules={[
          {
            required: true,
            message: "请输入名称",
            whitespace: true,
          },
        ]}
      >
        <Input maxLength={20} showCount />
      </Form.Item>
      <Form.Item
        name="sn"
        label="序号"
        rules={[
          {
            required: true,
            message: "请输入序号",
            whitespace: true,
          },
        ]}
      >
        <Input maxLength={20} showCount />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <Input.TextArea rows={4} maxLength={400} showCount />
      </Form.Item>
    </Form>
  );
}

export default forwardRef(ShelfForm);
