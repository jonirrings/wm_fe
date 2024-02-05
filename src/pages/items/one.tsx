import { SingleProps } from "../../utils/types";
import { useReadItemQuery } from "../../services/item";
import { Skeleton, Typography } from "antd";

function SingleItem(props: SingleProps) {
  const { id } = props;
  const { data, isLoading, error } = useReadItemQuery(id);

  function renderData() {
    if (data) {
      return (
        <Typography.Paragraph>
          <p>{data.name}</p>
          <p>{data.sn}</p>
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

export default SingleItem;
