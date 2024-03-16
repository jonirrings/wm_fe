import { useToken } from "../hooks/useToken";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Dropdown, Layout, MenuProps, Tabs, TabsProps } from "antd";
import LayoutHeader from "./components/Header";
import LayoutFooter from "./components/Footer";
import LayoutMenus from "./components/Menus";
import { useSelector } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../stores";
import { setActiveKey, setBreads, setCollapsed } from "../stores/public";
import cx from "classnames";
import styles from "./styles.module.less";
import useCachedTabs from "./hooks/useCachedTabs";
import useMatchRoute from "./hooks/useMatchRoute";
import { find, findIndex } from "lodash";
import { defaultMenus } from "../menus";
import { getMenuByKey } from "../menus/utils/helper";
import {
  CloseOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import TabMaximize from "./components/TabMaximize";

enum ITabEnums {
  CLOSE_CURRENT = "close_current", // 关闭当前
  CLOSE_OTHERS = "close_others", // 关闭其他
  CLOSE_LEFT = "close_left", // 关闭左侧
  CLOSE_RIGHT = "close_right", // 关闭右侧
}

function Layouts() {
  const dispatch: AppDispatch = useAppDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.public.isCollapsed,
  );
  const activeKey = useSelector((state: RootState) => state.public.activeKey);
  const breads = useSelector((state: RootState) => state.public.breads);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [getToken] = useToken();
  const token = getToken();
  const [tabs, tabsOps] = useCachedTabs();
  const matchRoute = useMatchRoute();
  useEffect(() => {
    if (activeKey !== pathname) {
      dispatch(setActiveKey(pathname));
    }
  }, [activeKey, pathname]);
  useEffect(() => {
    const tab = find(tabs, { key: pathname });
    if (tab && breads !== tab.ps) {
      dispatch(setBreads(tab.ps));
    }
  }, [tabs, breads, pathname]);

  useEffect(() => {
    if (!matchRoute) return;
    const ks = tabs.map((t) => t.key);
    const existed = ks.includes(pathname);
    const menuByKeyProps = {
      menus: defaultMenus,
      key: pathname,
    };
    const newItem = getMenuByKey(menuByKeyProps);
    if (!existed && newItem?.key && matchRoute.pathname === newItem.key) {
      tabsOps.addTab({
        ...newItem,
        className: "root-layout-content",
        children: matchRoute.children,
      });
    }
  }, [tabs, pathname, matchRoute]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  const onEdit: TabsProps["onEdit"] = (targetKey, action) => {
    if (action === "remove" && typeof targetKey === "string") {
      const idx = findIndex(tabs, { key: targetKey });
      const left = tabs[idx - 1];
      const right = tabs[idx + 1];
      tabsOps.closeTab(targetKey);
      if (activeKey === targetKey) {
        if (left) {
          navigate(left.key);
        } else if (right) {
          navigate(right.key);
        }
      }
    }
  };
  const getDropDownItems = (key: string) => {
    const idx = findIndex(tabs, { key });
    return [
      {
        key: ITabEnums.CLOSE_CURRENT,
        label: "关闭标签",
        disabled: tabs.length <= 1,
        icon: <CloseOutlined className="mr-5px" />,
      },
      {
        key: ITabEnums.CLOSE_OTHERS,
        label: "关闭其他",
        disabled: tabs.length <= 1,
        icon: (
          <VerticalAlignMiddleOutlined className="mr-5px transform rotate-90" />
        ),
      },
      {
        key: ITabEnums.CLOSE_LEFT,
        label: "关闭左侧",
        disabled: idx === 0,
        icon: (
          <VerticalAlignTopOutlined className="mr-5px transform rotate-270" />
        ),
      },
      {
        key: ITabEnums.CLOSE_RIGHT,
        label: "关闭右侧",
        disabled: idx === tabs.length - 1,
        icon: (
          <VerticalAlignTopOutlined className="mr-5px transform rotate-90" />
        ),
      },
    ] as MenuProps["items"];
  };
  const onDropDownClick = (type: string, key: string) => {
    const idx = findIndex(tabs, { key });
    const left = tabs[idx - 1];
    const right = tabs[idx + 1];
    const aIdx = findIndex(tabs, { key: activeKey });
    switch (type) {
      // 关闭当前
      case ITabEnums.CLOSE_CURRENT:
        tabsOps.closeTab(key);
        if (activeKey === key) {
          if (left) {
            navigate(left.key);
          } else if (right) {
            navigate(right.key);
          }
        }
        break;

      // 关闭其他
      case ITabEnums.CLOSE_OTHERS:
        tabsOps.closeOthers(key);
        if (activeKey !== key) {
          navigate(key);
        }
        break;

      // 关闭左侧
      case ITabEnums.CLOSE_LEFT:
        tabsOps.closeLeft(key);
        if (aIdx < idx) {
          navigate(key);
        }
        break;

      // 关闭右侧
      case ITabEnums.CLOSE_RIGHT:
        tabsOps.closeRight(key);
        if (aIdx > idx) {
          navigate(key);
        }
        break;

      default:
        break;
    }
  };
  const renderTabBar: TabsProps["renderTabBar"] = (
    tabBarProps,
    DefaultTabBar,
  ) => (
    <DefaultTabBar {...tabBarProps}>
      {(node) => (
        <Dropdown
          key={node.key}
          menu={{
            items: getDropDownItems(node.key as string),
            onClick: (e) => onDropDownClick(e.key, node.key as string),
          }}
          trigger={["contextMenu"]}
        >
          <div className="mr-3px">{node}</div>
        </Dropdown>
      )}
    </DefaultTabBar>
  );

  return (
    <Layout>
      <Layout.Sider
        collapsible
        collapsed={isCollapsed}
        onCollapse={(collapsed) => {
          dispatch(setCollapsed(collapsed));
        }}
      >
        <LayoutMenus />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          className={cx(
            styles.header,
            "flex items-center justify-between transition-all",
          )}
        >
          <LayoutHeader />
        </Layout.Header>
        <Layout.Content>
          <div className="flex items-center justify-between transition-all">
            {tabs.length > 0 ? (
              <Tabs
                hideAdd
                className={cx("w-full py-0", styles.contentTabs)}
                onChange={(key) => navigate(key)}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={tabs}
                renderTabBar={renderTabBar}
                tabBarExtraContent={
                  <div className="flex">
                    <div
                      className={cx(
                        "change divide-solid w-36px h-48px hover:opacity-70 flex place-content-center items-center",
                        styles.leftDivide,
                      )}
                    >
                      <TabMaximize />
                    </div>
                  </div>
                }
              />
            ) : (
              <span></span>
            )}
          </div>
        </Layout.Content>
        <Layout.Footer className="text-align-center mb-14px p-0px!">
          <LayoutFooter />
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}

export default Layouts;
