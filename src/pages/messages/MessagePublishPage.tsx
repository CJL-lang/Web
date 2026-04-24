import { useState } from "react";
import { CircleCheckBig, Send } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { mockCoaches, mockStudents } from "../../mocks/messageRecipients";
import type { SendMessagePayload, SystemMessageIconKind } from "../../types/message";
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

/**
 * 后台「发布系统消息」页：拟真收件人数据 + 模拟发送，便于联调 payload 与 UI 流程。
 * 结构：顶栏说明 → 成功提示（可选）→ 图标/标题/正文 → 双分组收件人 → 主操作。
 */
export function MessagePublishPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [coachIds, setCoachIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [iconKind, setIconKind] = useState<SystemMessageIconKind>("policy");

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

  const handleSend = () => {
    setSuccess(null);
    if (!validate()) {
      return;
    }

    const payload: SendMessagePayload = {
      title: title.trim(),
      body: body.trim(),
      studentIds: [...studentIds],
      coachIds: [...coachIds],
      iconKind,
    };

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      console.log("SendMessagePayload", payload);
      setSuccess(
        `已发送（模拟）：学员 ${payload.studentIds.length} 人，教练 ${payload.coachIds.length} 人。`
      );
    }, 650);
  };

  return (
    <div className="c-message-publish">
      <PageHeader eyebrow="Messaging" title="发布消息" />

      {success ? (
        <div className="c-status-banner c-status-banner--success">
          <CircleCheckBig className="c-status-banner__icon" size={18} />
          <p className="c-status-banner__text">{success}</p>
        </div>
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
          title="消息内容预览"
        >
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
              placeholder="例如：本周末活动提醒"
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
              placeholder="在此填写消息内容"
              value={body}
            />
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
