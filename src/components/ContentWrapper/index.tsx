import { ReactNode } from "react";
import cx from "classnames";
import styles from "./styles.module.less";

type Props = {
  children: ReactNode;
};
export default function (props: Props) {
  return (
    <div
      className={cx(
        styles.wrapper,
        "py-12px px-24px bg-white overflow-auto rounded-md",
      )}
    >
      {props.children}
    </div>
  );
}
