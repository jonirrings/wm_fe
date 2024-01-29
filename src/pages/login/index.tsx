import { App, Button, Form, Input, Space } from "antd";
import { LoginPayload, useLoginMutation } from "../../services";
import { Link, useNavigate } from "react-router-dom";
import { handleRTKError } from "../../utils/transformer.tsx";
import { useToken } from "../../hooks/useToken.ts";
import { useEffect } from "react";
import { getFirstRoute } from "../../menus/utils/helper.ts";
import { defaultMenus } from "../../menus";

function Login() {
  const [formRef] = Form.useForm();
  const [login] = useLoginMutation();
  const { message } = App.useApp();
  const [getToken, setToken] = useToken();
  const token = getToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const r = getFirstRoute(defaultMenus);
      navigate(r);
    }
  }, [token]);

  function onFinish(values: LoginPayload) {
    login(values)
      .unwrap()
      .then((resp) => {
        setToken(resp.token);
      })
      .catch((err) => handleRTKError(err, message));
  }

  return (
    <Form
      form={formRef}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "请输入用户名",
            whitespace: true,
          },
        ]}
      >
        <Input autoComplete="on" />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "请输入密码",
          },
        ]}
      >
        <Input.Password autoComplete="on" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          登陆
        </Button>
        <Space>
          <Link to="/register">注册</Link>
          <Link to="/forget_password">忘记密码</Link>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default Login;
