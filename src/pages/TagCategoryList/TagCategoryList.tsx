import React, { useMemo, useState } from "react";
import styles from "./TagCategoryList.module.scss";
import { useTagCategories } from "@/hooks/useTagCategories";
import type { ITagCategory } from "@/types/interfaces";
import TagCategoryForm from "@/components/TagCategoryForm/TagCategoryForm";
import TagCategoryCard from "@/components/TagCategoryCard/TagCategoryCard";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";

export default function TagCategoryList() {
  const {
    filtered,
    items,
    setQuery,
    query,
    statusFilter,
    setStatusFilter,
    create,
    update,
    softDelete,
    hardDelete,
  } = useTagCategories();
  const [showForm, setShowForm] = useState<{
    mode: "create" | "edit";
    item?: ITagCategory | null;
  } | null>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    item: ITagCategory | null;
  }>({ open: false, item: null });

  const defaultMetadata = useMemo(
    () => showForm?.item?.metadataConfig ?? items[0]?.metadataConfig ?? [],
    [showForm, items]
  );

  return (
    <div className={`container ${styles.wrap}`}>
      <header className={styles.header}>
        <div>
          <h1 className="h1">Tag Categories</h1>
          <div className="subtle">
            Create, edit, and manage complex tag categories
          </div>
        </div>
        <button
          className="button"
          onClick={() => setShowForm({ mode: "create", item: null })}
        >
          + New Category
        </button>
      </header>

      <div className={styles.controls}>
        <input
          className="input"
          placeholder="Search by name or group…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      {showForm && (
        <TagCategoryForm
          mode={showForm.mode}
          initial={showForm.item ?? null}
          metadataConfig={defaultMetadata}
          onCancel={() => setShowForm(null)}
          onSubmit={(payload) => {
            if (showForm.mode === "create") {
              const created = create({
                name: payload.name!,
                status: payload.status as any,
                precisionType: payload.precisionType as any,
                group: payload.group!,
                metadataConfig: defaultMetadata,
                nameStructure: ["name"],
                subCategories: {},
              });
              setShowForm(null);
            } else if (showForm.item) {
              update(showForm.item.id, payload as Partial<ITagCategory>);
              setShowForm(null);
            }
          }}
        />
      )}

      <section className="cardGrid">
        {filtered.map((it) => (
          <TagCategoryCard
            key={it.id}
            item={it}
            onEdit={(item) => setShowForm({ mode: "edit", item })}
            onDelete={(item) => setConfirm({ open: true, item })}
          />
        ))}
        {filtered.length === 0 && (
          <div className="panel" style={{ padding: 16 }}>
            No results. Try adjusting filters.
          </div>
        )}
      </section>

      <DeleteConfirmationModal
        open={confirm.open}
        title={`Delete “${confirm.item?.name ?? ""}”`}
        message="This will mark the item as deleted (soft delete). Proceed?"
        onCancel={() => setConfirm({ open: false, item: null })}
        onConfirm={() => {
          if (confirm.item) softDelete(confirm.item.id);
          setConfirm({ open: false, item: null });
        }}
      />
    </div>
  );
}
