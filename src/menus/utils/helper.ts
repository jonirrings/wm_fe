import { SideMenu } from "../../utils/types";
import { compact, split } from "lodash";

export function getOpenMenuByPath(path: string): string[] {
  const arr = splitPath(path);
  const res = [] as string[];
  for (let i = 1; i < arr.length; i++) {
    const p = arr.slice(0, i).join("/");
    res.push(`/${p}`);
  }
  return res;
}

/**
 * 匹配路径内的字段
 * @param path - 路径
 * @param arr - 路径经过数组
 */
function matchPath(path: string, arr: MenuPath[]): string[] {
  const result: string[] = [];

  // 分割路径
  const pathArr = splitPath(path);
  let left = 0;
  const right = pathArr.length;

  for (let i = 0; i < arr.length; i++) {
    const { path } = arr[i];
    if (path?.[left] === pathArr[left]) {
      result.push(arr[i].label);
      if (left < right - 1) left++;
    }
    if (left === right) return result;
  }

  return result;
}

export function splitPath(path: string): string[] {
  return compact(split(path, "/"));
}

/**
 * 搜索相应菜单值
 * @param menus - 菜单
 * @param permissions - 权限列表
 * @param value - 匹配值
 * @param currentPath - 当前路径
 * @param result - 返回值
 */

interface MenuPath {
  label: string;
  path: string[];
}

interface SearchMenuProps {
  menus: SideMenu[] | undefined;
  permissions: string[];
  value: string;
  currentPath?: MenuPath[];
  result?: SideMenu[];
}

export function searchMenuValue(data: SearchMenuProps): SideMenu[] {
  const { menus, permissions, value } = data;
  let { currentPath, result } = data;
  if (!menus?.length || !value) return [];
  if (!currentPath) currentPath = [];
  if (!result) result = [];

  for (let i = 0; i < menus.length; i++) {
    // 如果存在子数组则递归
    if (hasChildren(menus[i])) {
      currentPath.push({
        label: menus[i].label,
        path: splitPath(menus[i].key),
      });

      // 递归子数组，返回结果
      const childrenData = {
        menus: menus[i].children,
        permissions,
        value,
        currentPath,
        result,
      };
      const childResult = searchMenuValue(childrenData);

      // 当子数组返回值有值时则合并数组
      if (childResult.length) {
        result.concat(childResult);
      } else {
        currentPath.pop();
      }
    } else if (
      menus[i]?.label?.includes(value) &&
      hasPermission(menus[i], permissions)
    ) {
      currentPath.push({
        label: menus[i].label,
        path: splitPath(menus[i].key),
      });
      const nav = matchPath(menus[i].key, currentPath);

      // 匹配到value值时添加到result中
      const { label, key } = menus[i];
      result.push({ label, key, nav });
    }
  }

  return result;
}

interface GetMenuByKeyResult {
  label: string;
  key: string;
  ps: string[];
}

interface GetMenuByKeyProps {
  menus: SideMenu[] | undefined;
  key: string;
  fatherNav?: string[];
  result?: GetMenuByKeyResult;
}

export function getMenuByKey(
  data: GetMenuByKeyProps,
): GetMenuByKeyResult | undefined {
  const { menus, key } = data;
  let { fatherNav, result } = data;
  if (!menus?.length) return result;
  if (!fatherNav) fatherNav = [];
  if (!result?.key)
    result = {
      key: "",
      label: "",
      ps: [],
    };

  for (let i = 0; i < menus.length; i++) {
    if (!key || (result as GetMenuByKeyResult).key) return result;

    // 过滤子数据中值
    if (hasChildren(menus[i])) {
      fatherNav.push(menus[i].label);

      // 递归子数组，返回结果
      const childProps = {
        menus: menus[i].children,
        key,
        fatherNav,
        result,
      };
      const childResult = getMenuByKey(childProps);

      // 当子数组返回值
      if (childResult?.key) {
        result = childResult;
      } else {
        // 下次递归前删除面包屑前一步错误路径
        fatherNav.pop();
      }
    } else if (menus[i]?.key === key) {
      fatherNav.push(menus[i].label);
      const { label, key } = menus[i];
      if (key) result = { label, key, ps: fatherNav };
    }
  }

  return result;
}

/**
 * 过滤权限菜单
 * @param menus - 菜单
 * @param permissions - 权限列表
 */
export function filterMenus(
  menus: SideMenu[],
  permissions: string[],
): SideMenu[] {
  const result: SideMenu[] = [];
  const newMenus = JSON.parse(JSON.stringify(menus));

  for (let i = 0; i < newMenus.length; i++) {
    // 处理子数组
    if (hasChildren(newMenus[i])) {
      const result = filterMenus(
        newMenus[i].children as SideMenu[],
        permissions,
      );

      // 有子权限数据则保留
      newMenus[i].children = result?.length ? result : undefined;
    }

    // 有权限或有子数据累加
    if (hasPermission(newMenus[i], permissions) || hasChildren(newMenus[i]))
      result.push(newMenus[i]);
  }

  return result;
}

export function getFirstMenu(
  menus: SideMenu[],
  permissions: string[],
  result = "",
): string {
  // 有结构时直接返回
  if (result) return result;

  for (let i = 0; i < menus.length; i++) {
    // 处理子数组
    if (hasChildren(menus[i]) && !result) {
      const childResult = getFirstMenu(
        menus[i].children as SideMenu[],
        permissions,
        result,
      );

      // 有结果则赋值
      if (childResult) {
        result = childResult;
        return result;
      }
    }

    // 有权限且没有有子数据
    if (hasPermission(menus[i], permissions) && !hasChildren(menus[i])) {
      result = menus[i].key;
    }
  }

  return result;
}

/**
 * 路由是否权限
 * @param route - 路由
 * @param permissions - 权限
 */
function hasPermission(route: SideMenu, permissions: string[]): boolean {
  return permissions?.includes(route?.rule || "");
}

/**
 * 是否有子路由
 * @param route - 路由
 */
function hasChildren(route: SideMenu): boolean {
  return Boolean(route.children?.length);
}

export function getFirstRoute(routes: SideMenu[]): string {
  if (routes.length) {
    const r = routes[0];
    if (r.children && r.children.length) {
      return getFirstRoute(r.children);
    } else {
      return r.key;
    }
  }
  return "/";
}
