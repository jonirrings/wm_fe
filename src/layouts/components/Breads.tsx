import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { Breadcrumb, BreadcrumbProps } from "antd";
import { useMemo } from "react";

export default function () {
  const breads = useSelector((state: RootState) => state.public.breads);
  const items: BreadcrumbProps["items"] = useMemo(() => {
    return breads.map((title) => ({ title }));
  }, [breads]);
  return (
    <div className="flex items-center">
      <Breadcrumb items={items} />
    </div>
  );
}
