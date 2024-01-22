/// <reference types="vite/client" />
type SideMenu = {
    label: string;
    key: string;
    icon?: React.ReactNode;
    rule?: string; // 路由权限
    nav?: string[]; // 面包屑路径
    children?: SideMenu[];
}
