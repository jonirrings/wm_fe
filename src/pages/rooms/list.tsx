import {
  BizRoom,
  useDeleteRoomMutation,
  useDeleteRoomsMutation,
  useReadRoomsQuery,
} from "../../services/room";
import { useEffect } from "react";
import { App, Button, Modal, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import RoomForm from "./RoomForm";
import { IDType } from "../../utils/types";
import {
  handleBatchResult,
  handleRTKError,
  renderDate,
} from "../../utils/transformer";
import usePager from "../../hooks/usePager";
import useMF from "../../hooks/useMF";
import useRowSelection from "../../hooks/useRowSelection";
import ContentContainer from "../../components/ContentContainer";
import ContentWrapper from "../../components/ContentWrapper";

function RoomList() {
  const [{ page, size, sort }, pager] = usePager();
  const [mf, mfOps] = useMF<BizRoom>();
  const [rs, rsOps] = useRowSelection<BizRoom>("room_id");
  const [delOne] = useDeleteRoomMutation();
  const [delMany, { isLoading: deletingMany }] = useDeleteRoomsMutation();
  const { message, modal } = App.useApp();
  const { data, isLoading } = useReadRoomsQuery({
    sort,
    limit: size,
    offset: (page - 1) * size,
  });
  useEffect(() => {
    if (page > 1 && (!data || data.data.length === 0)) pager.prev();
  }, [data]);
  const cols: ColumnsType<BizRoom> = [
    {
      title: "ID",
      dataIndex: "room_id",
      key: "id",
      width: 80,
      sorter: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      width: 100,
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

  function renderForm() {
    if (mf.vis) {
      return (
        <RoomForm
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
    <ContentContainer>
      <ContentWrapper>
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
        <Table<BizRoom>
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
          rowKey="room_id"
        />
      </ContentWrapper>
      <Modal
        title={mf.text + "房间"}
        open={mf.vis}
        onCancel={mfOps.toHide}
        onOk={mfOps.submit}
        confirmLoading={mf.loading}
        destroyOnClose
      >
        {renderForm()}
      </Modal>
    </ContentContainer>
  );
}

export default RoomList;
