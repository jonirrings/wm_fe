import { SingleProps } from "../../utils/types";
import { useReadRoomQuery } from "../../services/room";
import { Skeleton, Typography } from "antd";

type Props = SingleProps & { simple?: boolean };

function SingleRoom(props: Props) {
  const { id, simple } = props;
  const { data, isLoading, error } = useReadRoomQuery(id);

  function renderData() {
    if (data) {
      if (simple) return <Typography.Text>{data.name}</Typography.Text>;
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
