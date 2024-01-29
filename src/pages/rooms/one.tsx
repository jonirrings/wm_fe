import { SingleProps } from "../../utils/types.ts";
import { useReadRoomQuery } from "../../services";
import { Skeleton, Typography } from "antd";

function SingleRoom(props: SingleProps) {
  const { id } = props;
  const { data, isLoading, error } = useReadRoomQuery(id);

  function renderData() {
    if (data) {
      return (
        <Typography.Paragraph>
          <p>{data.name}</p>
          <p>{data.description}</p>
        </Typography.Paragraph>
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

  return (
    <Skeleton active loading={isLoading}>
      {renderData()}
      {renderError()}
    </Skeleton>
  );
}

export default SingleRoom;
