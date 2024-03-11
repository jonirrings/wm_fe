import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import { IDType, SFProps, SimpleForm } from "../../utils/types";
import {
  BizRoom,
  RoomPayload,
  useCreateRoomMutation,
  useUpdateRoomMutation,
} from "../../services/room";
import { App, Form, Input } from "antd";
import { handleRTKError } from "../../utils/transformer";

type Props = SFProps<BizRoom>;

function RoomForm(props: Props, ref: Ref<SimpleForm>) {
  const { draft, onSuccess, onLoading } = props;
  const [formRef] = Form.useForm<RoomPayload>();
  const [create, { isLoading: creating }] = useCreateRoomMutation();
  const [update, { isLoading: updating }] = useUpdateRoomMutation();
  const { message } = App.useApp();
  const isEditing = !!draft;
  const loading = creating || updating;
  useEffect(() => {
    onLoading(loading);
  }, [loading]);
  useImperativeHandle(ref, () => ({
    submit: () => formRef.submit(),
  }));

  function onFinish(values: RoomPayload) {
    let p: Promise<IDType>;
    if (isEditing) {
      p = update({ ...values, id: draft.room_id }).unwrap();
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
      <Form.Item name="description" label="描述">
        <Input.TextArea rows={4} maxLength={400} showCount />
      </Form.Item>
    </Form>
  );
}

export default forwardRef(RoomForm);
