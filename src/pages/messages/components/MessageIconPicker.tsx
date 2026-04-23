import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { SystemInboxMessageIcon } from "../../../components/messages/SystemInboxMessageIcon";
import {
  SYSTEM_MESSAGE_ICON_CATEGORY_ORDER,
  SYSTEM_MESSAGE_ICON_OPTIONS,
  type SystemMessageIconCategory,
  type SystemMessageIconKind,
} from "../../../types/message";

/**
 * 发布页「消息图标」子系统：与 SectionCard 标题区、表单之间的预览行、快捷入口、
 * <dialog> 选图三件套共享 Context，保证预览与弹层选项同步。
 */
interface MessageIconPickerContextValue {
  value: SystemMessageIconKind;
  onChange: (kind: SystemMessageIconKind) => void;
  titlePreview: string;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  pickerOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  selectKind: (kind: SystemMessageIconKind) => void;
  grouped: Map<
    SystemMessageIconCategory,
    (typeof SYSTEM_MESSAGE_ICON_OPTIONS)[number][]
  >;
  previewNow: Date;
}

/** React Context 实例：默认值 `null`，仅允许在 Provider 包裹下消费 */
const MessageIconPickerContext =
  createContext<MessageIconPickerContextValue | null>(null);

/** 消费 Context；若不在 Provider 内则抛错，避免静默使用默认值 */
function useMessageIconPickerContext() {
  const ctx = useContext(MessageIconPickerContext);
  if (!ctx) {
    throw new Error(
      "MessageIconPicker components must be used within MessageIconPickerProvider"
    );
  }
  return ctx;
}

/** 与收件箱列表行一致：展示「今天 HH:MM」 */
function formatListPreviewTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `今天 ${h}:${m}`;
}

/** `MessageIconPickerProvider` 的 props：受控图标 kind、标题预览文案（用于列表行模拟） */
interface MessageIconPickerProviderProps {
  children: ReactNode;
  value: SystemMessageIconKind;
  onChange: (kind: SystemMessageIconKind) => void;
  titlePreview: string;
}

/** 提供 dialog ref、选项分组、开关状态及选图回调，包裹发布页中依赖图标的子树 */
export function MessageIconPickerProvider({
  children,
  onChange,
  titlePreview,
  value,
}: MessageIconPickerProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewNow] = useState(() => new Date());

  const grouped = useMemo(() => {
    const map = new Map<
      SystemMessageIconCategory,
      (typeof SYSTEM_MESSAGE_ICON_OPTIONS)[number][]
    >();
    for (const opt of SYSTEM_MESSAGE_ICON_OPTIONS) {
      const list = map.get(opt.category) ?? [];
      list.push(opt);
      map.set(opt.category, list);
    }
    return map;
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) {
      return;
    }
    const onClose = () => setPickerOpen(false);
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, []);

  const openDialog = useCallback(() => {
    dialogRef.current?.showModal();
    setPickerOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const selectKind = useCallback(
    (kind: SystemMessageIconKind) => {
      onChange(kind);
      dialogRef.current?.close();
    },
    [onChange]
  );

  const ctxValue = useMemo(
    () => ({
      value,
      onChange,
      titlePreview,
      dialogRef,
      pickerOpen,
      openDialog,
      closeDialog,
      selectKind,
      grouped,
      previewNow,
    }),
    [
      value,
      onChange,
      titlePreview,
      pickerOpen,
      openDialog,
      closeDialog,
      selectKind,
      grouped,
      previewNow,
    ]
  );

  return (
    <MessageIconPickerContext.Provider value={ctxValue}>
      {children}
    </MessageIconPickerContext.Provider>
  );
}

/** 列表风格预览行：置于 SectionCard 头部 description 槽，点击打开选图弹层 */
export function MessageIconPreviewTrigger() {
  const {
    openDialog,
    pickerOpen,
    previewNow,
    titlePreview,
    value,
  } = useMessageIconPickerContext();

  const previewTitle = titlePreview.trim();
  const timeLabel = formatListPreviewTime(previewNow);

  return (
    <button
      aria-controls="message-icon-dialog"
      aria-expanded={pickerOpen}
      aria-haspopup="dialog"
      aria-label="选择消息图标"
      className="c-message-icon-preview-row"
      type="button"
      onClick={openDialog}
    >
      <div
        className="c-system-message-icon-swatch c-system-message-icon-swatch--inline"
        data-system-kind={value}
      >
        <SystemInboxMessageIcon kind={value} size={26} />
      </div>
      <p
        className="c-message-icon-preview-row__title"
        data-empty={previewTitle ? undefined : ""}
      >
        {previewTitle || "消息标题"}
      </p>
      <span className="c-message-icon-preview-row__time">{timeLabel}</span>
    </button>
  );
}

/** 表单区快捷区：展示当前图标与「切换」，与预览行共用同一 `<dialog>` */
export function MessageIconAddShortcut() {
  const { openDialog, pickerOpen, value } = useMessageIconPickerContext();

  return (
    <div className="c-message-icon-add-shortcut">
      <span className="c-message-icon-add-shortcut__label" id="message-icon-add-label">
        添加图标
      </span>
      <div className="c-message-icon-add-shortcut__row">
        <div
          aria-hidden
          className="c-system-message-icon-swatch c-system-message-icon-swatch--inline c-message-icon-add-shortcut__current"
          data-system-kind={value}
        >
          <SystemInboxMessageIcon kind={value} size={26} />
        </div>
        <button
          aria-controls="message-icon-dialog"
          aria-expanded={pickerOpen}
          aria-haspopup="dialog"
          aria-label="切换消息图标"
          className="c-message-icon-add-shortcut__btn"
          type="button"
          onClick={openDialog}
        >
          <span className="c-message-icon-add-shortcut__btn-label">切换</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 全屏 <dialog> 图标选择器。须放在 MessageIconPickerProvider 内；可与触发器不同层级。
 * 内部分组 radio，选中即提交并 close。
 */
export function MessageIconPickerDialog() {
  const {
    closeDialog,
    dialogRef,
    grouped,
    selectKind,
    value,
  } = useMessageIconPickerContext();

  const radioName = "message-publish-icon-kind";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="message-icon-dialog-title"
      className="c-message-icon-picker__dialog"
      id="message-icon-dialog"
    >
      <div
        className="c-message-icon-picker__dialog-surface"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            closeDialog();
          }
        }}
      >
        <div
          className="c-message-icon-picker__dialog-panel"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <header className="c-message-icon-picker__dialog-header">
            <h2
              className="c-message-icon-picker__dialog-title"
              id="message-icon-dialog-title"
            >
              选择消息图标
            </h2>
            <button
              aria-label="关闭"
              className="c-message-icon-picker__dialog-close"
              type="button"
              onClick={closeDialog}
            >
              <X size={20} aria-hidden />
            </button>
          </header>
          <p className="c-message-icon-picker__dialog-hint">
            选择与标题气质相近的样式；收件人将看到相同图标与背景色。
          </p>

          <div className="c-message-icon-picker__groups c-message-icon-picker__groups--scroll">
            {SYSTEM_MESSAGE_ICON_CATEGORY_ORDER.map((category) => {
              const options = grouped.get(category);
              if (!options?.length) {
                return null;
              }
              return (
                <div key={category} className="c-message-icon-picker__section">
                  <p className="c-message-icon-picker__section-title">
                    {category}
                  </p>
                  <div className="c-message-icon-picker__grid">
                    {options.map((opt) => {
                      const selected = value === opt.kind;
                      return (
                        <label
                          key={opt.kind}
                          className="c-message-icon-picker__option"
                        >
                          <input
                            checked={selected}
                            className="c-sr-only"
                            name={radioName}
                            onChange={() => selectKind(opt.kind)}
                            type="radio"
                            value={opt.kind}
                          />
                          <div
                            className={
                              selected
                                ? "c-system-message-icon-swatch is-selected"
                                : "c-system-message-icon-swatch"
                            }
                            data-system-kind={opt.kind}
                          >
                            <SystemInboxMessageIcon kind={opt.kind} size={24} />
                          </div>
                          <span className="c-message-icon-picker__label">
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="c-message-icon-picker__dialog-footer">
            <Button type="button" variant="secondary" onClick={closeDialog}>
              完成
            </Button>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
