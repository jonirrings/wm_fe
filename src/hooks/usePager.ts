import { useState } from "react";
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from "antd/es/table/interface";
import { capitalize } from "lodash";

function usePager<RecordType = any>(i = 1, s = 10) {
  const [page, setPage] = useState(i);
  const [size, setSize] = useState(s);
  const [sort, setSort] = useState<string>();

  const onPageChange = (i: number, s: number) => {
    setPage(i);
    setSize(s);
  };
  const onPFSChange = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    _extra: TableCurrentDataSource<RecordType>,
  ) => {
    // ignore pagination contemporarily
    if (!Array.isArray(sorter)) {
      const field = (sorter.columnKey || sorter.field) as string; //we only support single factor sort
      switch (sorter.order) {
        case "ascend":
          setSort(capitalize(field) + "Asc");
          break;
        case "descend":
          setSort(capitalize(field) + "Desc");
          break;
        default:
          setSort(undefined);
      }
    }
  };
  const first = () => setPage(1);
  const prev = () => setPage((p) => p - 1);
  const next = () => setPage((p) => p + 1);

  return [
    { page, size, sort },
    { onChange: onPageChange, first, prev, next, onPFSChange },
  ] as const;
}

export default usePager;
