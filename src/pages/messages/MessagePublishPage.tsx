import { useCallback, useEffect, useState } from "react";
import { CircleAlert, CircleCheckBig, Save, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { mockCoaches, mockStudents } from "../../mocks/messageRecipients";
import {
  clearDraft,
  getDraft,
  getSentMessage,
  saveDraft,
  sendMessage,
} from "../../services/messageService";
import type {
  MessageComposerData,
  SystemMessageIconKind,
} from "../../types/message";
import {
  MessageIconAddShortcut,
  MessageIconPickerDialog,
  MessageIconPickerProvider,
  MessageIconPreviewTrigger,
} from "./components/MessageIconPicker";
import { RecipientGroupPicker } from "./components/RecipientGroupPicker";

/** 发布表单校验错误：键与 `InputField` / Banner 展示字段对应 */
interface FieldErrors {
  title?: string;
  body?: string;
  recipients?: string;
}

type NoticeKind = "success" | "info" | "error";

interface Notice {
  kind: NoticeKind;
  text: string;
}

const DEFAULT_ICON_KIND: SystemMessageIconKind = "policy";

function hasDraftContent(data: MessageComposerData) {
  return (
    data.title.trim().length > 0 ||
    data.body.trim().length > 0 ||
    data.studentIds.length > 0 ||
    data.coachIds.length > 0
  );
}

function formatDraftSavedAt(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/**
 * 后台「发布系统消息」页：拟真收件人数据 + 模拟发送，便于联调 payload 与 UI 流程。
 * 结构：成功提示（可选）→ 图标/标题/正文 → 双分组收件人 → 主操作。
 */
export function MessagePublishPage() {
  const [searchParams] = useSearchParams();
  const sourceId = searchParams.get("source");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [coachIds, setCoachIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [iconKind, setIconKind] =
    useState<SystemMessageIconKind>(DEFAULT_ICON_KIND);
  const applyComposerData = useCallback((data: MessageComposerData) => {
    setTitle(data.title);
    setBody(data.body);
    setStudentIds([...data.studentIds]);
    setCoachIds([...data.coachIds]);
    setIconKind(data.iconKind);
    setErrors({});
  }, []);

  const resetComposer = () => {
    setTitle("");
    setBody("");
    setStudentIds([]);
    setCoachIds([]);
    setIconKind(DEFAULT_ICON_KIND);
    setErrors({});
  };

  const getComposerData = (): MessageComposerData => ({
    title,
    body,
    studentIds: [...studentIds],
    coachIds: [...coachIds],
    iconKind,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setIsLoadingInitial(true);
      setNotice(null);

      if (sourceId) {
        const source = await getSentMessage(sourceId);
        if (cancelled) {
          return;
        }

        if (source) {
          applyComposerData(source);
          setNotice({
            kind: "info",
            text: "已从历史记录复用内容，可继续编辑后重新发送。",
          });
        } else {
          setNotice({
            kind: "error",
            text: "未找到要复用的历史记录。",
          });
        }
        setIsLoadingInitial(false);
        return;
      }

      const draft = await getDraft();
      if (cancelled) {
        return;
      }

      if (draft) {
        applyComposerData(draft);
        setNotice({
          kind: "info",
          text: `已恢复 ${formatDraftSavedAt(draft.updatedAt)} 保存的草稿。`,
        });
      }
      setIsLoadingInitial(false);
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [applyComposerData, sourceId]);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!title.trim()) {
      next.title = "请输入标题";
    }
    if (!body.trim()) {
      next.body = "请输入正文";
    }
    if (studentIds.length === 0 && coachIds.length === 0) {
      next.recipients = "请至少选择一名学员或一名教练";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveDraft = async () => {
    setNotice(null);
    const data = getComposerData();

    if (!hasDraftContent(data)) {
      setNotice({
        kind: "error",
        text: "空白消息无法保存为草稿，请至少填写标题、正文或选择发送对象。",
      });
      return;
    }

    setIsSavingDraft(true);
    try {
      const draft = await saveDraft(data);
      setNotice({
        kind: "success",
        text: `草稿已保存（${formatDraftSavedAt(draft.updatedAt)}）。`,
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSend = async () => {
    setNotice(null);
    if (!validate()) {
      return;
    }

    const payload: MessageComposerData = {
      title: title.trim(),
      body: body.trim(),
      studentIds: [...studentIds],
      coachIds: [...coachIds],
      iconKind,
    };

    setIsSubmitting(true);
    try {
      const record = await sendMessage(payload);
      await clearDraft();
      resetComposer();
      setNotice({
        kind: "success",
        text: `已发送：学员 ${record.studentCount} 人，教练 ${record.coachCount} 人。`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="c-message-publish">
      <PageHeader eyebrow="Messaging" title="发布消息" />

      {notice ? (
        <div className={`c-status-banner c-status-banner--${notice.kind}`}>
          {notice.kind === "success" ? (
            <CircleCheckBig className="c-status-banner__icon" size={18} />
          ) : (
            <CircleAlert className="c-status-banner__icon" size={18} />
          )}
          <p className="c-status-banner__text">{notice.text}</p>
        </div>
      ) : null}

      {isLoadingInitial ? (
        <p className="c-message-publish__loading">正在读取消息草稿…</p>
      ) : null}

      {/* 为预览区与弹层共享图标 kind 与 ref，子组件从 Context 取状态 */}
      <MessageIconPickerProvider
        titlePreview={title}
        value={iconKind}
        onChange={setIconKind}
      >
        <SectionCard
          className="c-section-card--message-content"
          description={<MessageIconPreviewTrigger />}
          eyebrow="列表预览"
          title="消息内容"
        >
          <div
            aria-label="编辑标题与正文"
            className="c-message-publish__composer"
            role="group"
          >
            <div className="c-message-publish__composer-head">
              <p className="c-message-publish__composer-kicker">编辑区</p>
            </div>
            <div className="c-message-publish__content-stack">
              <MessageIconPickerDialog />
              <MessageIconAddShortcut />
              <InputField
                error={errors.title}
                label="标题"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((c) => ({ ...c, title: undefined }));
                }}
                value={title}
              />
              <TextareaField
                className="c-message-publish__body-textarea"
                error={errors.body}
                label="正文"
                onChange={(e) => {
                  setBody(e.target.value);
                  setErrors((c) => ({ ...c, body: undefined }));
                }}
                value={body}
              />
            </div>
          </div>
        </SectionCard>
      </MessageIconPickerProvider>

      <SectionCard className="c-section-card--message-recipients" title="发送对象">
        <div className="c-message-publish__recipients-stack">
          {errors.recipients ? (
            <p className="c-validation-banner" role="alert">
              {errors.recipients}
            </p>
          ) : null}
          <div className="c-recipient-grid">
            <RecipientGroupPicker
              items={mockStudents}
              onChange={(next) => {
                setStudentIds(next);
                setErrors((c) => ({ ...c, recipients: undefined }));
              }}
              selectedIds={studentIds}
              title="学员"
            />
            <RecipientGroupPicker
              items={mockCoaches}
              onChange={(next) => {
                setCoachIds(next);
                setErrors((c) => ({ ...c, recipients: undefined }));
              }}
              selectedIds={coachIds}
              title="教练"
            />
          </div>
        </div>
      </SectionCard>

      <div className="c-message-publish__actions">
        <Button
          className="c-message-publish__draft-btn"
          disabled={isSubmitting || isSavingDraft}
          onClick={handleSaveDraft}
          type="button"
          variant="secondary"
        >
          <span className="c-message-publish__send-inner">
            <Save size={16} aria-hidden />
            {isSavingDraft ? "保存中…" : "保存草稿"}
          </span>
        </Button>
        <Button
          className="c-message-publish__send-btn"
          disabled={isSubmitting}
          onClick={handleSend}
          type="button"
        >
          <span className="c-message-publish__send-inner">
            <Send size={16} aria-hidden />
            {isSubmitting ? "发送中…" : "发送"}
          </span>
        </Button>
      </div>
    </div>
  );
}
