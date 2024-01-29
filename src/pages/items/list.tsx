import {
  BizItem,
  useDeleteItemMutation,
  useReadItemsQuery,
} from "../../services";
import { useRef, useState } from "react";
import { App, Button, Modal, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import ItemForm from "./ItemForm.tsx";
import { IDType, SimpleForm } from "../../utils/types.ts";
import { handleRTKError } from "../../utils/transformer.tsx";

function ItemsList() {
  const modalFormRef = useRef<SimpleForm>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [draft, setDraft] = useState<BizItem>();
  const [vis, setVis] = useState(false);
  const [del] = useDeleteItemMutation();
  const { message } = App.useApp();
  const { data, isLoading } = useReadItemsQuery({
    limit: size,
    offset: (page - 1) * size,
  });
  const cols: ColumnsType<BizItem> = [
    {
      title: "ID",
      dataIndex: "item_id",
      width: 80,
    },
    {
      title: "序列号",
      dataIndex: "sn",
      width: 100,
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
      dataIndex: "item_id",
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

  function toEdit(d: BizItem) {
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
        <ItemForm ref={modalFormRef} draft={draft} onSuccess={hideModal} />
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
      <Table<BizItem>
        columns={cols}
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          onChange: (p, s) => {
            setPage(p);
            setSize(s);
          },
        }}
        rowKey="item_id"
      />
      <Modal title="物品" open={vis} onCancel={hideModal} onOk={triggerSubmit}>
        {renderForm()}
      </Modal>
    </>
  );
}

export default ItemsList;
