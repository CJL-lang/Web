import { useEffect, useMemo, useState } from "react";
import { History, Inbox, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SystemInboxMessageIcon } from "../../components/messages/SystemInboxMessageIcon";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { mockCoaches, mockStudents } from "../../mocks/messageRecipients";
import { listSentMessages } from "../../services/messageService";
import type { SentMessageRecord } from "../../types/message";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRecipientPreview(record: SentMessageRecord, nameById: Map<string, string>) {
  const names = [...record.studentIds, ...record.coachIds]
    .map((id) => nameById.get(id))
    .filter(Boolean);

  if (names.length === 0) {
    return "未记录具体对象";
  }

  const visible = names.slice(0, 3).join("、");
  return names.length > 3 ? `${visible} 等 ${names.length} 人` : visible;
}

function getBodyPreview(body: string) {
  const text = body.replace(/\s+/g, " ").trim();
  if (text.length <= 86) {
    return text;
  }
  return `${text.slice(0, 86)}…`;
}

export function MessageHistoryPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<SentMessageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const nameById = useMemo(() => {
    return new Map(
      [...mockStudents, ...mockCoaches].map((recipient) => [
        recipient.id,
        recipient.name,
      ])
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setIsLoading(true);
      const nextRecords = await listSentMessages();
      if (!cancelled) {
        setRecords(nextRecords);
        setIsLoading(false);
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReuse = (id: string) => {
    navigate(`/messages/publish?source=${encodeURIComponent(id)}`);
  };

  return (
    <div className="c-message-history">
      <PageHeader
        eyebrow="Messaging"
        title="历史记录"
        description="查看通过发布页发送过的系统消息，并可复用内容创建新消息。"
      />

      <SectionCard
        className="c-section-card--message-history"
        title="已发送消息"
        description={records.length > 0 ? `共 ${records.length} 条记录` : ""}
      >
        {isLoading ? (
          <p className="c-message-history__loading">正在读取历史记录…</p>
        ) : records.length === 0 ? (
          <EmptyState
            badge="History"
            description="从发送消息页成功发送后，记录会出现在这里。"
            icon={Inbox}
            title="暂无发送历史"
          />
        ) : (
          <ul className="c-message-history__list">
            {records.map((record) => (
              <li className="c-message-history__item" key={record.id}>
                <div
                  className="c-system-message-icon-swatch c-system-message-icon-swatch--inline c-message-history__icon"
                  data-system-kind={record.iconKind}
                >
                  <SystemInboxMessageIcon kind={record.iconKind} size={26} />
                </div>

                <div className="c-message-history__content">
                  <div className="c-message-history__title-row">
                    <h3 className="c-message-history__title">{record.title}</h3>
                    <span className="c-message-history__time">
                      <History size={14} aria-hidden />
                      {formatDateTime(record.sentAt)}
                    </span>
                  </div>
                  <p className="c-message-history__body">
                    {getBodyPreview(record.body)}
                  </p>
                  <div className="c-message-history__meta">
                    <span>学员 {record.studentCount} 人</span>
                    <span>教练 {record.coachCount} 人</span>
                    <span>{getRecipientPreview(record, nameById)}</span>
                  </div>
                </div>

                <Button
                  className="c-message-history__reuse-btn"
                  onClick={() => handleReuse(record.id)}
                  type="button"
                  variant="secondary"
                >
                  <RotateCcw size={16} aria-hidden />
                  复用
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
