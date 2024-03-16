import type { TabPaneProps } from "antd";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  differenceBy,
  dropRightWhile,
  dropWhile,
  intersectionBy,
  omit,
  unionBy,
} from "lodash";

export type ETab = Omit<TabPaneProps, "tab"> & {
  key: string;
  label: ReactNode;
  ps: string[]; //path es
};

export default function useCachedTabs() {
  const [cachedTabs, setCachedTabs] = useState<ETab[]>([]);

  useEffect(() => {
    const [c0, ...rest] = cachedTabs;
    if (cachedTabs.length === 1) {
      const c0 = cachedTabs[0];
      if (c0.closable === undefined || c0.closable === true) {
        setCachedTabs([{ ...c0, closable: false }]);
      }
    } else if (cachedTabs.length > 1) {
      if (c0.closable !== undefined) {
        setCachedTabs([omit(c0, ["closable"]), ...rest]);
      }
    }
  }, [cachedTabs]);

  const actions = useMemo(
    () => ({
      addTab: (t: ETab) => setCachedTabs((cc) => unionBy(cc, [t], "key")),
      closeTab: (key: string) =>
        setCachedTabs((cc) => differenceBy(cc, [{ key }], "key")),
      closeOthers: (key: string) =>
        setCachedTabs((cc) => intersectionBy(cc, [{ key }], "key")),
      closeAll: () => setCachedTabs([]),
      closeLeft: (k: string) =>
        setCachedTabs((cc) => dropWhile(cc, (c) => c.key !== k)),
      closeRight: (k: string) =>
        setCachedTabs((cc) => dropRightWhile(cc, (c) => c.key !== k)),
    }),
    [],
  );

  return [cachedTabs, actions] as const;
}
