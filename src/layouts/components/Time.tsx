import { useState } from "react";
import { useRafInterval } from "ahooks";
import dayjs from "dayjs";
import styles from "../styles.module.less";

export default function Time() {
  const [time, setTime] = useState(dayjs().format("LL LTS A"));
  useRafInterval(() => {
    setTime(dayjs().format("LL LTS A"));
  }, 1000);
  return <span className={styles.topTime}>{time}</span>;
}
