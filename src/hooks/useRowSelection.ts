import { useSet } from "ahooks";
import { AnyObject } from "antd/es/_util/type";
import { IDType } from "../utils/types";
import { buildRowSelection } from "../utils/transformer";

function useRowSelection<U extends AnyObject = AnyObject>(
  key: keyof U,
  disabledFn?: (r: U) => boolean,
) {
  const [keys, keysOps] = useSet<IDType>();
  const selectedKeys: IDType[] = Array.from(keys);
  const rowSelection = buildRowSelection<IDType, U>(
    selectedKeys,
    keysOps.add,
    keysOps.remove,
    key,
    disabledFn,
  );
  return [{ selectedKeys, rowSelection }, keysOps] as const;
}

export default useRowSelection;
