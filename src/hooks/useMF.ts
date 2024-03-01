import { useState } from "react";
import { IDType } from "../utils/types"; // Modal Form

// Modal Form
function useMF<T>() {
  const [vis, setVis] = useState(false);
  const [id, setId] = useState<IDType>();
  const [draft, setDraft] = useState<T>();

  const toCreate = () => {
    setId(undefined);
    setDraft(undefined);
    setVis(true);
  };
  const toDup = (d: T) => {
    setId(undefined);
    setDraft(d);
    setVis(true);
  };
  const toEdit = (i: IDType, d: T) => {
    setId(i);
    setDraft(d);
    setVis(true);
  };
  const toHide = () => {
    setId(undefined);
    setDraft(undefined);
    setVis(false);
  };
  let text: string = "查看";
  if (id && draft) {
    text = "编辑";
  } else if (!id && draft) {
    text = "复制";
  } else if (!id && !draft) {
    text = "创建";
  }

  return [
    { text, vis, id, draft },
    {
      toCreate,
      toDup,
      toEdit,
      toHide,
    },
  ] as const;
}

export default useMF;
