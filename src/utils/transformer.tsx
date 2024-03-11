import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { BatchResult, ErrResult, IDType, Result, RTKError } from "./types";
import { TableRowSelection } from "antd/es/table/interface";
import { AnyObject } from "antd/es/_util/type";
import { HookAPI } from "antd/es/modal/useModal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EMPTY_VALUE, errCodeMap } from "./constants";
import { get } from "lodash";

export function handleRTKError<T = any>(
  err: RTKError<T>,
  message: MessageInstance,
  _form?: FormInstance,
) {
  const { data, status } = err;
  switch (status) {
    case 400: {
      const r = data as ErrResult;
      return message.error(r.message);
    }
    case 417: {
      const r = data as ErrResult;
      return message.error(r.message);
    }
    default: {
      const r = data as ErrResult;
      const defErrMsg = errCodeMap.get(status);
      return message.error(get(r, ["message"], defErrMsg));
    }
  }
}

export function extractResp<T>(resp: Result<T>) {
  return resp.data;
}

export function handleBatchResult(
  data: BatchResult,
  modal: HookAPI,
  message: MessageInstance,
) {
  if (data.f && data.f.length) {
    modal.confirm({
      title: "批量删除结果",
      style: { padding: "12px 12px 4px 12px" },
      icon: <ExclamationCircleOutlined />,
      content: (
        <div style={{ maxHeight: 500, overflow: "auto" }}>
          <div style={{ marginBottom: 12 }}>
            成功删除
            <strong style={{ color: "green" }}> {data.s} </strong>
            条，失败删除
            <strong style={{ color: "red" }}> {data.f.length} </strong>
            条。
          </div>
          <div style={{ margin: "8px 0", fontWeight: 700 }}>失败原因如下：</div>
          {data.f.map(({ name, reason }) => (
            <div key={name}>
              {name}：{reason}
            </div>
          ))}
        </div>
      ),
      onOk: (close) => close(),
    });
  } else {
    message.success("批量删除成功");
  }
}

type SetFn<T> = (id: T) => void;

export function buildRowSelection<
  T extends IDType = IDType,
  U extends AnyObject = AnyObject,
>(
  keys: T[],
  add: SetFn<T>,
  remove: SetFn<T>,
  key: keyof U,
  disabledFn?: (r: U) => boolean,
): TableRowSelection<U> {
  return {
    selectedRowKeys: keys,
    getCheckboxProps: (record) => ({
      disabled: disabledFn ? disabledFn(record) : undefined,
    }),
    onSelect: (record, selected) => {
      const func = selected ? add : remove;
      func(record[key]);
    },
    onSelectAll: (selected, _selectedRows, changeRows) => {
      const func = selected ? add : remove;
      changeRows.forEach((r) => func(r[key]));
    },
  };
}

export function renderDate(
  v: undefined | null | number | string,
  // inSec?: boolean,
) {
  if (v) {
    /*let d: dayjs.Dayjs;
    if (inSec) {
      d = dayjs.unix(v as number);
    } else {
      d = dayjs(v);
    }*/
    const d = dayjs(v);
    if (d.isValid()) {
      return d.format("L LTS");
    }
    return EMPTY_VALUE;
  }
  return EMPTY_VALUE;
}
