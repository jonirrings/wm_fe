import { Avatar, Skeleton } from "antd";
import { useMeQuery } from "../services/user";
import { UserOutlined } from "@ant-design/icons";

function Header() {
  const { data, isLoading, error } = useMeQuery();

  function renderData() {
    if (data) {
      return <Avatar alt={data.username} icon={<UserOutlined />} />;
    }
    return null;
  }

  function renderError() {
    if (error) {
      return JSON.stringify(error);
    }
    return null;
  }

  return (
    <Skeleton active avatar loading={isLoading}>
      {renderData()}
      {renderError()}
    </Skeleton>
  );
}

export default Header;
