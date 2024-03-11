import { forwardRef, Ref, useEffect, useImperativeHandle } from "react";
import { IDType, SFProps, SimpleForm } from "../../utils/types";
import {
  BizShelf,
  ShelfPayload,
  useCreateShelfMutation,
  useUpdateShelfMutation,
} from "../../services/shelf";
import { App, Form, Input, InputNumber, Select } from "antd";
import { handleRTKError } from "../../utils/transformer";
import { useReadAllRoomsQuery } from "../../services/room";

type Props = SFProps<BizShelf>;

function ShelfForm(props: Props, ref: Ref<SimpleForm>) {
  const { draft, onSuccess, onLoading } = props;
  const [formRef] = Form.useForm<ShelfPayload>();
  const { data: rooms, isLoading } = useReadAllRoomsQuery(null);
  const [create, { isLoading: creating }] = useCreateShelfMutation();
  const [update, { isLoading: updating }] = useUpdateShelfMutation();
  const { message } = App.useApp();
  const loading = creating || updating;
  const isEditing = !!draft;
  useEffect(() => {
    onLoading(loading);
  }, [loading]);
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
        <Input maxLength={20} showCount />
      </Form.Item>
      <Form.Item name="layer" label="层数" rules={[{ required: true }]}>
        <InputNumber precision={0} min={1} />
      </Form.Item>
      <Form.Item name="room_id" label="房间" rules={[{ required: true }]}>
        <Select
          loading={isLoading}
          options={rooms?.map((r) => ({
            label: r.name,
            value: r.room_id,
          }))}
          showSearch
        />
      </Form.Item>
    </Form>
  );
}

export default forwardRef(ShelfForm);
