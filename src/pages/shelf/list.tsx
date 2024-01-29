import {
  BizShelf,
  useDeleteShelfMutation,
  useReadShelvesQuery,
} from "../../services";
import { useRef, useState } from "react";
import { App, Button, Modal, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { IDType, SimpleForm } from "../../utils/types.ts";
import { PlusOutlined } from "@ant-design/icons";
import ShelfForm from "./ShelfForm.tsx";
import { handleRTKError } from "../../utils/transformer.tsx";

function ShelfList() {
  const modalFormRef = useRef<SimpleForm>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [draft, setDraft] = useState<BizShelf>();
  const [vis, setVis] = useState(false);
  const [del] = useDeleteShelfMutation();
  const { message } = App.useApp();
  const { data, isLoading } = useReadShelvesQuery({
    limit: size,
    offset: (page - 1) * size,
  });
  const cols: ColumnsType<BizShelf> = [
    {
      title: "ID",
      dataIndex: "shelf_id",
      width: 80,
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "房间",
      dataIndex: "room_id",
      width: 100,
    },
    {
      title: "层数",
      dataIndex: "layer",
      width: 80,
    },
    {
      title: "操作",
      dataIndex: "shelf_id",
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
      .catch((err) => handleRTKError(err, message));
  }

  function toCreate() {
    setDraft(undefined);
    setVis(true);
  }

  function toEdit(d: BizShelf) {
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
        <ShelfForm ref={modalFormRef} draft={draft} onSuccess={hideModal} />
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
      <Table<BizShelf>
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
        rowKey="shelf_id"
      />
      <Modal title="货架" open={vis} onCancel={hideModal} onOk={triggerSubmit}>
        {renderForm()}
      </Modal>
    </>
  );
}

export default ShelfList;
