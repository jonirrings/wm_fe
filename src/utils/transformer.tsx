import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { ErrResult, Result, RTKError } from "./types.ts";

export function handleRTKError<T = any>(
  err: RTKError<T>,
  message: MessageInstance,
  _form?: FormInstance,
) {
  const { data, status } = err;
  switch (status) {
    case 400:
    case 500: {
      const r = data as ErrResult;
      return message.error(r.message);
    }
    case 417: {
      const r = data as ErrResult;
      return message.error(r.message);
    }
  }
}

export function extractResp<T>(resp: Result<T>) {
  return resp.data;
}