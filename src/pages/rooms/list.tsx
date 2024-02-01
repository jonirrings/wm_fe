import {
  BizRoom,
  useDeleteRoomMutation,
  useReadRoomsQuery,
} from "../../services";
import { useRef, useState } from "react";
import { App, Button, Modal, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import RoomForm from "./RoomForm.tsx";
import { IDType, SimpleForm } from "../../utils/types.ts";
import { handleRTKError } from "../../utils/transformer.tsx";

function RoomsList() {
  const modalFormRef = useRef<SimpleForm>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [draft, setDraft] = useState<BizRoom>();
  const [vis, setVis] = useState(false);
  const [del] = useDeleteRoomMutation();
  const { message } = App.useApp();
  const { data, isLoading } = useReadRoomsQuery({
    limit: size,
    offset: (page - 1) * size,
  });
  const cols: ColumnsType<BizRoom> = [
    {
      title: "ID",
      dataIndex: "room_id",
      width: 80,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "操作",
      dataIndex: "room_id",
      key: "ops",
      width: 200,
      render: (id: IDType, row) => (
        <Space>
          <Typography.Link onClick={() => toEdit(row)}>编辑</Typography.Link>
          <Typography.Link onClick={() => toDelete(id)}>删除</Typography.Link>
        </Space>
      ),
    },
  ];

  function toDelete(id: IDType) {
    del(id)
      .unwrap()
      .then(() => {
        if (data?.data.length === 1 && page > 1) {
          setPage((p) => p - 1);
        }
      })
      .catch((err) => handleRTKError(err, message));
  }

  function toCreate() {
    setDraft(undefined);
    setVis(true);
  }

  function toEdit(d: BizRoom) {
    setDraft(d);
    setVis(true);
  }

  function hideModal() {
    setDraft(undefined);
    setVis(false);
  }

  function triggerSubmit() {
    modalFormRef.current?.submit();
  }

  function renderForm() {
    if (vis) {
      return (
        <RoomForm ref={modalFormRef} draft={draft} onSuccess={hideModal} />
      );
    }
    return null;
  }

  return (
    <>
      <div>
        <Button icon={<PlusOutlined />} onClick={toCreate}>
          新增
        </Button>
      </div>
      <Table<BizRoom>
        columns={cols}
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          onChange: (p, s) => {
            setPage(p);
            setSize(s);
          },
          pageSize: size,
          current: page,
          total: data?.total,
        }}
        rowKey="room_id"
      />
      <Modal
        title="房间"
        open={vis}
        onCancel={hideModal}
        onOk={triggerSubmit}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </>
  );
}

export default RoomsList;
