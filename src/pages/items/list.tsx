import {
  BizItem,
  useDeleteItemMutation,
  useDeleteItemsMutation,
  useReadItemsQuery,
} from "../../services/item";
import { useEffect, useRef } from "react";
import { App, Button, Modal, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import ItemForm from "./ItemForm";
import { IDType, SimpleForm } from "../../utils/types";
import { handleBatchResult, handleRTKError } from "../../utils/transformer";
import usePager from "../../hooks/usePager";
import useMF from "../../hooks/useMF";
import useRowSelection from "../../hooks/useRowSelection";

function ItemList() {
  const modalFormRef = useRef<SimpleForm>(null);
  const [{ page, size, sort }, pager] = usePager();
  const [mf, mfOps] = useMF<BizItem>();
  const [rs, rsOps] = useRowSelection<BizItem>("item_id");
  const [delOne] = useDeleteItemMutation();
  const [delMany, { isLoading: deletingMany }] = useDeleteItemsMutation();
  const { message, modal } = App.useApp();
  const { data, isLoading } = useReadItemsQuery({
    sort,
    limit: size,
    offset: (page - 1) * size,
  });

  useEffect(() => {
    if (page > 1 && (!data || data.data.length === 0)) pager.prev();
  }, [data]);

  const cols: ColumnsType<BizItem> = [
    {
      title: "ID",
      dataIndex: "item_id",
      key: "id",
      width: 80,
      sorter: true,
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
      sorter: true,
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
          <Typography.Link onClick={() => mfOps.toEdit(id, row)}>
            编辑
          </Typography.Link>
          <Typography.Link onClick={() => toDelete(id)}>删除</Typography.Link>
        </Space>
      ),
    },
  ];

  function toDelete(id: IDType) {
    delOne(id)
      .unwrap()
      .then(() => {
        rsOps.remove(id);
        return message.success("删除成功");
      })
      .catch((err) => handleRTKError(err, message));
  }

  function batchDel() {
    delMany(rs.selectedKeys)
      .unwrap()
      .then((r) => {
        handleBatchResult(r, modal, message);
        rsOps.reset();
      })
      .catch((err) => handleRTKError(err, message));
  }

  function triggerSubmit() {
    modalFormRef.current?.submit();
  }

  function renderForm() {
    if (mf.vis) {
      return (
        <ItemForm
          ref={modalFormRef}
          draft={mf.draft}
          onSuccess={mfOps.toHide}
        />
      );
    }
    return null;
  }

  return (
    <>
      <div>
        <Button
          loading={deletingMany}
          disabled={rs.selectedKeys.length === 0}
          onClick={batchDel}
        >
          批量删除
        </Button>
        <Button icon={<PlusOutlined />} onClick={mfOps.toCreate}>
          新增
        </Button>
      </div>
      <Table<BizItem>
        columns={cols}
        dataSource={data?.data}
        loading={isLoading}
        rowSelection={rs.rowSelection}
        onChange={pager.onPFSChange}
        pagination={{
          onChange: pager.onChange,
          pageSize: size,
          current: page,
          total: data?.total,
        }}
        rowKey="item_id"
      />
      <Modal
        title={mf.text + "物品"}
        open={mf.vis}
        onCancel={mfOps.toHide}
        onOk={triggerSubmit}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </>
  );
}

export default ItemList;
