import React, { useMemo } from "react";
import styles from "./TagCategoryForm.module.scss";
import type {
  IMetadataField,
  ISelectMetadata,
  ITagCategory,
} from "@/types/interfaces";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
  precisionType: z.enum(["LONG", "SHORT", "MEDIUM"]),
  groupLabel: z.string().min(1, "Group label is required"),
  groupValue: z.string().min(1, "Group value is required"),
});

export type FormValues = z.infer<typeof schema> & {
  metadata: Record<string, unknown>;
};

interface Props {
  mode: "create" | "edit";
  initial?: ITagCategory | null;
  metadataConfig: IMetadataField[];
  onSubmit: (
    values: Partial<ITagCategory> & { metadata: Record<string, unknown> }
  ) => void;
  onCancel: () => void;
}

export default function TagCategoryForm({
  mode,
  initial,
  metadataConfig,
  onSubmit,
  onCancel,
}: Props) {
  const defaults = useMemo<FormValues>(
    () => ({
      name: initial?.name ?? "",
      status: (initial?.status as any) ?? "ACTIVE",
      precisionType: (initial?.precisionType as any) ?? "LONG",
      groupLabel: initial?.group?.label ?? "",
      groupValue: initial?.group?.value ?? "",
      metadata: {},
    }),
    [initial]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const renderField = (field: IMetadataField) => {
    if (field.component === "input") {
      return (
        <div className={styles.field} key={field.key}>
          <label className={styles.label}>
            {field.label} {field.required && "*"}
          </label>
          <input
            className="input"
            {...register(`metadata.${field.key}` as const)}
            type={field.type}
            readOnly={(field as any).readOnly}
          />
        </div>
      );
    }

    const f = field as ISelectMetadata;
    if (f.mode === "options") {
      return (
        <div className={styles.field} key={field.key}>
          <label className={styles.label}>
            {field.label} {field.required && "*"}
          </label>
          <Controller
            control={control}
            name={`metadata.${field.key}` as any}
            render={({ field: ctl }) => (
              <select className="select" {...ctl} multiple={!!f.multiple}>
                {!f.multiple && <option value="">Select…</option>}
                {f.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
          <span className={styles.help}>
            Mode: options{f.multiple ? " (multiple)" : ""}
          </span>
        </div>
      );
    }

    // mode === 'query' (stubbed UI)
    return (
      <div className={styles.field} key={field.key}>
        <label className={styles.label}>
          {field.label} {field.required && "*"}
        </label>
        <input
          className="input"
          placeholder={`Type to search ${f.query}`}
          {...register(`metadata.${field.key}` as const)}
        />
        <span className={styles.help}>Query source: {f.query}</span>
      </div>
    );
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((vals) => {
        const payload: Partial<ITagCategory> & {
          metadata: Record<string, unknown>;
        } = {
          name: vals.name,
          status: vals.status as any,
          precisionType: vals.precisionType as any,
          group: { label: vals.groupLabel, value: vals.groupValue },
          metadata: vals.metadata,
        };
        onSubmit(payload);
      })}
    >
      <h3 className="h1" style={{ fontSize: 22 }}>
        {mode === "create" ? "Create Tag Category" : "Edit Tag Category"}
      </h3>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label}>Name *</label>
          <input
            className="input"
            placeholder="e.g. Ball"
            {...register("name")}
          />
          {errors.name && (
            <span className="badge warning">{errors.name.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Status *</label>
          <select className="select" {...register("status")}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Precision *</label>
          <select className="select" {...register("precisionType")}>
            <option value="LONG">LONG</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="SHORT">SHORT</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Group Label *</label>
          <input
            className="input"
            placeholder="e.g. ball"
            {...register("groupLabel")}
          />
          {errors.groupLabel && (
            <span className="badge warning">{errors.groupLabel.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Group Value *</label>
          <input
            className="input"
            placeholder="e.g. ball"
            {...register("groupValue")}
          />
          {errors.groupValue && (
            <span className="badge warning">{errors.groupValue.message}</span>
          )}
        </div>
      </div>

      <div className={styles.subPanel}>
        <strong>Metadata Configuration</strong>
        <div className={styles.grid}>{metadataConfig.map(renderField)}</div>
      </div>

      <div className={styles.row}>
        <button className="button" type="submit">
          {mode === "create" ? "Create" : "Save changes"}
        </button>
        <button className="button ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
