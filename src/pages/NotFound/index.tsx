import { Divider, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function NotFound() {
  return (
    <Typography>
      <Title>页面不存在</Title>
      <Paragraph>
        404啦， 你访问了一个不存在的页面，是不是
        <Text strong>哪儿出问题了？</Text>
      </Paragraph>
      <Divider />
      <Paragraph>
        要不试试回到
        <Link to="/">首页</Link>
      </Paragraph>
    </Typography>
  );
}

export default NotFound;
