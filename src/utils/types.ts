export type IDType = string | number;
export type VFunc = (e?: any) => void; // void func
export type SideMenu = {
  label: string;
  key: string;
  icon?: React.ReactNode;
  rule?: string; // 路由权限
  nav?: string[]; // 面包屑路径
  children?: SideMenu[];
};

type Failure = {
  name: string;
  reason: string;
};
export type BatchResult = {
  s: number;
  f?: Failure[];
};

export type Result<T = any> = {
  data: T;
  message: string;
};
export type Paged<T = any> = {
  total: number;
  data: T[];
};
export type QParam = {
  limit?: number;
  offset?: number;
  sort?: string;
};
export type ErrResult = {
  message: string;
};

export type RTKError<T = any> = {
  status: number;
  data: T;
};

export type SimpleForm = {
  submit: VFunc;
};
export type SFProps<T> = {
  draft?: T;
  onSuccess: VFunc;
};

export type SingleProps = {
  id: IDType;
};
