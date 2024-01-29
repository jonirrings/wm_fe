import { SingleProps } from "../../utils/types.ts";
import { useReadShelfQuery } from "../../services";
import { Skeleton, Typography } from "antd";

function SingleShelf(props: SingleProps) {
  const { id } = props;
  const { data, isLoading, error } = useReadShelfQuery(id);

  function renderData() {
    if (data) {
      return (
        <Typography.Paragraph>
          <p>{data.name}</p>
          <p>{data.layer}</p>
          <p>{data.room_id}</p>
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

export default SingleShelf;
