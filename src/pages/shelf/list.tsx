import {
  BizShelf,
  useDeleteShelfMutation,
  useDeleteShelvesMutation,
  useReadShelvesQuery,
} from "../../services/shelf";
import { useEffect, useState } from "react";
import {
  App,
  Button,
  Form,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { IDType } from "../../utils/types";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ShelfForm from "./ShelfForm";
import {
  handleBatchResult,
  handleRTKError,
  renderDate,
} from "../../utils/transformer";
import SingleRoom from "../rooms/one";
import usePager from "../../hooks/usePager";
import useMF from "../../hooks/useMF";
import useRowSelection from "../../hooks/useRowSelection";
import { useReadAllRoomsQuery } from "../../services/room";

type QueryForm = {
  room_id?: IDType;
};

function ShelfList() {
  const [formRef] = Form.useForm();
  const [{ page, size, sort }, pager] = usePager();
  const [mf, mfOps] = useMF<BizShelf>();
  const [rs, rsOps] = useRowSelection<BizShelf>("shelf_id");
  const [delOne] = useDeleteShelfMutation();
  const [delMany, { isLoading: deletingMany }] = useDeleteShelvesMutation();
  const { message, modal } = App.useApp();
  const [queryForm, setQF] = useState<QueryForm>();
  const { data, isLoading } = useReadShelvesQuery({
    sort,
    limit: size,
    offset: (page - 1) * size,
    ...queryForm,
  });
  const { data: rooms, isLoading: loadingR } = useReadAllRoomsQuery(null);

  useEffect(() => {
    if (page > 1 && (!data || data.data.length === 0)) pager.prev();
  }, [data]);
  const cols: ColumnsType<BizShelf> = [
    {
      title: "ID",
      dataIndex: "shelf_id",
      key: "id",
      width: 80,
      sorter: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 80,
      sorter: true,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      width: 180,
      render: renderDate,
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      width: 180,
      render: renderDate,
    },
    {
      title: "层数",
      dataIndex: "layer",
      width: 80,
    },
    {
      title: "房间",
      dataIndex: "room_id",
      render: (room_id: IDType) => <SingleRoom id={room_id} simple />,
    },
    {
      title: "操作",
      dataIndex: "shelf_id",
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

  function onSearch(values: QueryForm) {
    setQF(values);
  }

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

  function renderForm() {
    if (mf.vis) {
      return (
        <ShelfForm
          ref={mf.ref}
          draft={mf.draft}
          onSuccess={mfOps.toHide}
          onLoading={mfOps.onLoading}
        />
      );
    }
    return null;
  }

  return (
    <>
      <Form<QueryForm> layout="inline" form={formRef} onFinish={onSearch}>
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
        <Form.Item name="room_id" label="房间">
          <Select
            loading={loadingR}
            options={rooms?.map((r) => ({
              label: r.name,
              value: r.room_id,
            }))}
            style={{ width: "6em" }}
            showSearch
            allowClear
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          shape="circle"
          icon={<SearchOutlined />}
        />
      </Form>
      <Table<BizShelf>
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
        rowKey="shelf_id"
      />
      <Modal
        title={mf.text + "货架"}
        open={mf.vis}
        onCancel={mfOps.toHide}
        onOk={mfOps.submit}
        confirmLoading={mf.loading}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </>
  );
}

export default ShelfList;
