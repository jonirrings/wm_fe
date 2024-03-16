import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function (props: Props) {
  return (
    <div className="p-16px">
      <div className="w-full h-full box-border overflow-auto">
        {props.children}
      </div>
    </div>
  );
}
