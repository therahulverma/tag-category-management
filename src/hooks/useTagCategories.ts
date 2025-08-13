import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { ITagCategory } from "@/types/interfaces";
import sampleData from "@/data/sampleData.json";

export function useTagCategories() {
  const [items, setItems] = useState<ITagCategory[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (Array.isArray(sampleData)) {
      setItems(sampleData as ITagCategory[]);
    } else if (sampleData && typeof sampleData === "object") {
      setItems([sampleData as ITagCategory]);
    } else {
      console.error("Invalid sample data format:", sampleData);
      setItems([]);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((it) => {
      if (statusFilter !== "ALL" && it.status !== statusFilter) return false;
      if (!query) return true;
      return (
        it.name.toLowerCase().includes(query.toLowerCase()) ||
        it.group?.label?.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [items, query, statusFilter]);

  function create(item: Omit<ITagCategory, "id" | "createdAt" | "deleted">) {
    const now = Date.now();
    const next: ITagCategory = {
      ...item,
      id: uuid(),
      createdAt: now,
      deleted: false,
    };
    setItems((prev) => [next, ...prev]);
    return next;
  }

  function update(id: string, patch: Partial<ITagCategory>) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  function softDelete(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, deleted: true } : it))
    );
  }

  function hardDelete(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return {
    items,
    filtered,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    create,
    update,
    softDelete,
    hardDelete,
  };
}
