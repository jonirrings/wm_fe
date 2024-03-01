import { App, Button, Form, Input } from "antd";
import { RegisterPayload, useRegisterMutation } from "../../services/user";
import { Link, useNavigate } from "react-router-dom";
import { handleRTKError } from "../../utils/transformer";
import { useToken } from "../../hooks/useToken";
import { useEffect } from "react";
import { getFirstRoute } from "../../menus/utils/helper";
import { defaultMenus } from "../../menus";

function Register() {
  const [formRef] = Form.useForm();
  const [register] = useRegisterMutation();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [getToken] = useToken();
  const token = getToken();
  useEffect(() => {
    if (token) {
      const r = getFirstRoute(defaultMenus);
      navigate(r);
    }
  }, [token]);

  function onFinish(values: RegisterPayload) {
    register(values)
      .unwrap()
      .then(() => {
        navigate("/login");
        return message.success(`注册成功`);
      })
      .catch((err) => handleRTKError(err, message));
  }

  return (
    <Form
      form={formRef}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete={"on"}
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
        name="email"
        label="邮件"
        rules={[
          {
            type: "email",
            message: "无效邮件地址",
          },
          {
            required: true,
            message: "请输入邮件地址",
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
        hasFeedback
      >
        <Input.Password autoComplete="on" />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label="密码确认"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "请输入密码确认",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("输入的密码不匹配"));
            },
          }),
        ]}
      >
        <Input.Password autoComplete="on" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
        <Link to="/login">登陆</Link>
      </Form.Item>
    </Form>
  );
}

export default Register;
