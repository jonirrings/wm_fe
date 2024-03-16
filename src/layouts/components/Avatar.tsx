import { useMeQuery } from "../../services/user";
import { Avatar, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function () {
  const { data, isLoading, error } = useMeQuery();

  function renderData() {
    if (data) {
      return (
        <div className="text-lg">
          <Avatar size="small" alt={data.username} icon={<UserOutlined />} />
          <span className="ml-2">{data.username}</span>
        </div>
      );
    }
    return null;
  }

  function renderError() {
    if (error) {
      return JSON.stringify(error);
    }
    return null;
  }

  //todo: add user logout and preference
  return (
    <Skeleton active avatar loading={isLoading}>
      {renderData()}
      {renderError()}
    </Skeleton>
  );
}
