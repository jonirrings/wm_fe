import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./syles.module.less";
import { ReactNode } from "react";
import { getFirstMenu } from "../../menus/utils/helper";
import { defaultMenus } from "../../menus";
import { useCommonStore } from "../../hooks/useCommonStore";

type Props = {
  code?: number;
  children: ReactNode;
};

export const InternalErrorElement = (
  <ErrorPage>哎呀, 页面渲染失败了！</ErrorPage>
);
export const NotFoundErrorElement = (
  <ErrorPage code={404}>当前页面无法访问，可能没权限或已删除</ErrorPage>
);
export const ForbiddenErrorElement = (
  <ErrorPage code={403}>很抱歉，您的访问请求被禁止!</ErrorPage>
);

export default function ErrorPage(props: Props) {
  const { code = 500, children } = props;
  const { permissions } = useCommonStore();
  const navigate = useNavigate();

  /** 跳转首页 */
  const goIndex = () => {
    const firstMenu = getFirstMenu(defaultMenus, permissions);
    navigate(firstMenu);
  };

  return (
    <div className="absolute left-50% top-50% -translate-x-1/2 -translate-y-1/2 text-center">
      <h1 className={`${styles.animation} w-full text-6rem font-bold`}>
        {code}
      </h1>
      <p className="w-full text-20px font-bold mt-15px text-dark-700">
        {children}
      </p>
      <Button className="mt-25px margin-auto" onClick={goIndex}>
        返回首页
      </Button>
    </div>
  );
}
