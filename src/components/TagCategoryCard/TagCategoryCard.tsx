import React from "react";
import styles from "./TagCategoryCard.module.scss";
import type { ITagCategory } from "@/types/interfaces";

interface Props {
  item: ITagCategory;
  onEdit: (item: ITagCategory) => void;
  onDelete: (item: ITagCategory) => void;
}

export default function TagCategoryCard({ item, onEdit, onDelete }: Props) {
  const statusClass =
    item.status === "ACTIVE" ? "badge success" : "badge warning";
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{item.name}</div>
          <div className={styles.meta}>
            <span className={statusClass}>{item.status}</span>
            <span className="badge">Precision: {item.precisionType}</span>
            {item.group?.label && (
              <span className="badge">Group: {item.group.label}</span>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <button className="button secondary" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button className="button danger" onClick={() => onDelete(item)}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.kv}>
          <strong>Fields:</strong>{" "}
          {item.metadataConfig.map((m) => m.label).join(", ") || "—"}
        </div>
        {item.subCategories && (
          <div className={styles.kv}>
            <strong>Subcategories:</strong>{" "}
            {Object.values(item.subCategories)
              .map((s) => s.label)
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
