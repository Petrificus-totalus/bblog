import React from "react";
import styles from "./algoCard.module.css";
import { Tag } from "antd";

export default function Algorithmcard({ params, showDetail }) {
  const { desc, labels, id } = params;
  return (
    <div className={styles.container} onClick={() => showDetail(id)}>
      <div className={styles.desc}>{desc}</div>

      <div className={styles.content}>
        <div className={styles.tag}>
          {labels.map((item) => (
            <Tag key={item.id}>{item.name}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
