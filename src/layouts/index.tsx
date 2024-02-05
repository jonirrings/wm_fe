import { useToken } from "../hooks/useToken";
import { useNavigate, useOutlet } from "react-router-dom";
// import { AppDispatch, useAppDispatch } from "../stores";
import { useEffect } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import Menus from "./Menus";

function Layouts() {
  // const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const [getToken] = useToken();
  const token = getToken();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Menus />
        </Layout.Sider>
        <Layout.Content>{outlet}</Layout.Content>
      </Layout>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
}

export default Layouts;
