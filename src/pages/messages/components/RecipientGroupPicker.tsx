import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { MessageRecipient } from "../../../types/message";
import { cn } from "../../../utils/cn";
import { Button } from "../../../components/ui/Button";

/** 单分组（学员或教练）的可搜索多选列表之外部约定 */
interface RecipientGroupPickerProps {
  title: string;
  items: MessageRecipient[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  error?: string;
  /** 外层栅格上追加 class（如响应式列宽）时传入 */
  className?: string;
}

/** 点选单行时在已选 id 集合中切换指定 id 的包含关系 */
function toggleId(list: string[], id: string): string[] {
  if (list.includes(id)) {
    return list.filter((x) => x !== id);
  }
  return [...list, id];
}

/**
 * 单分组多选：搜索过滤、全选/全选结果、清空；样式见 `components.recipient-group.css`。
 * 行选中态用 `:has(:checked)` 在 CSS 中处理，本组件不再拼接 `is-selected`。
 */
export function RecipientGroupPicker({
  className,
  error,
  items,
  onChange,
  selectedIds,
  title,
}: RecipientGroupPickerProps) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!query) {
      return items;
    }
    return items.filter((i) => i.name.toLowerCase().includes(query));
  }, [items, query]);

  const allIds = items.map((i) => i.id);
  const filteredIds = filteredItems.map((i) => i.id);

  const allSelected =
    items.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const allFilteredSelected =
    filteredItems.length > 0 &&
    filteredIds.every((id) => selectedIds.includes(id));
  const anySelected = selectedIds.length > 0;

  const handleSelectAllToggle = () => {
    if (query) {
      if (allFilteredSelected) {
        onChange(selectedIds.filter((id) => !filteredIds.includes(id)));
      } else {
        const next = new Set(selectedIds);
        for (const id of filteredIds) {
          next.add(id);
        }
        onChange([...next]);
      }
      return;
    }
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...allIds]);
    }
  };

  const selectAllLabel = query
    ? allFilteredSelected
      ? "取消全选"
      : "全选结果"
    : allSelected
      ? "取消全选"
      : "全选";

  return (
    <div className={cn("c-recipient-group", className)}>
      <div className="c-recipient-group__header">
        <h3 className="c-recipient-group__title">{title}</h3>
        <div className="c-recipient-group__actions">
          <Button
            className="c-recipient-group__action-button"
            disabled={filteredItems.length === 0}
            onClick={handleSelectAllToggle}
            type="button"
            variant="secondary"
          >
            {selectAllLabel}
          </Button>
          {anySelected ? (
            <Button
              className="c-recipient-group__action-button"
              onClick={() => onChange([])}
              type="button"
              variant="danger"
            >
              清空
            </Button>
          ) : null}
        </div>
      </div>

      <div className="c-recipient-group__search">
        <Search
          aria-hidden
          className="c-recipient-group__search-icon"
          size={18}
        />
        <input
          aria-label={`在「${title}」中按姓名搜索`}
          className="c-recipient-group__search-input"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索姓名…"
          type="search"
          value={search}
        />
      </div>

      <ul className="c-recipient-group__list">
        {filteredItems.length === 0 ? (
          <li className="c-recipient-group__empty" role="status">
            {query ? "无匹配的姓名" : "暂无人员"}
          </li>
        ) : (
          filteredItems.map((item) => {
            const checked = selectedIds.includes(item.id);
            return (
              <li key={item.id}>
                <label className="c-recipient-group__item">
                  <input
                    checked={checked}
                    className="c-recipient-group__checkbox"
                    onChange={() => onChange(toggleId(selectedIds, item.id))}
                    type="checkbox"
                  />
                  <span className="c-recipient-group__name">{item.name}</span>
                </label>
              </li>
            );
          })
        )}
      </ul>

      {error ? <p className="c-recipient-group__error">{error}</p> : null}
    </div>
  );
}
