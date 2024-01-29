import { forwardRef, Ref, useImperativeHandle } from "react";
import { IDType, SFProps, SimpleForm } from "../../utils/types.ts";
import {
  BizShelf,
  ShelfPayload,
  useCreateShelfMutation,
  useUpdateShelfMutation,
} from "../../services";
import { App, Form, Input, InputNumber, Select } from "antd";
import { handleRTKError } from "../../utils/transformer.tsx";

type Props = SFProps<BizShelf>;

function ShelfForm(props: Props, ref: Ref<SimpleForm>) {
  const { draft, onSuccess } = props;
  const [formRef] = Form.useForm<ShelfPayload>();
  const [create] = useCreateShelfMutation();
  const [update] = useUpdateShelfMutation();
  const { message } = App.useApp();
  const isEditing = !!draft;
  useImperativeHandle(ref, () => ({
    submit: () => formRef.submit(),
  }));

  function onFinish(values: ShelfPayload) {
    let p: Promise<IDType>;
    if (isEditing) {
      p = update({ ...values, id: draft.shelf_id }).unwrap();
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
        <Input disabled={isEditing} maxLength={20} showCount />
      </Form.Item>
      <Form.Item name="layer" label="层数">
        <InputNumber precision={0} min={1} disabled={isEditing} />
      </Form.Item>
      <Form.Item name="room_id" label="房间">
        <Select />
      </Form.Item>
    </Form>
  );
}

export default forwardRef(ShelfForm);
