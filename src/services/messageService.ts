import type {
  MessageComposerData,
  MessageDraft,
  SentMessageRecord,
} from "../types/message";

const MESSAGE_DRAFT_STORAGE_KEY = "golf-academy-admin:message-draft";
const SENT_MESSAGES_STORAGE_KEY = "golf-academy-admin:sent-messages";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

function readJson<T>(key: string, fallback: T): T {
  const storage = getStorage();
  if (!storage) {
    return fallback;
  }

  const raw = storage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    storage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  storage.setItem(key, JSON.stringify(value));
}

function createRecordId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeComposerData(data: MessageComposerData): MessageComposerData {
  return {
    title: data.title.trim(),
    body: data.body.trim(),
    studentIds: [...data.studentIds],
    coachIds: [...data.coachIds],
    iconKind: data.iconKind,
  };
}

export async function getDraft(): Promise<MessageDraft | null> {
  return readJson<MessageDraft | null>(MESSAGE_DRAFT_STORAGE_KEY, null);
}

export async function saveDraft(data: MessageComposerData): Promise<MessageDraft> {
  const draft: MessageDraft = {
    ...normalizeComposerData(data),
    updatedAt: new Date().toISOString(),
  };
  writeJson(MESSAGE_DRAFT_STORAGE_KEY, draft);
  return draft;
}

export async function clearDraft(): Promise<void> {
  getStorage()?.removeItem(MESSAGE_DRAFT_STORAGE_KEY);
}

export async function listSentMessages(): Promise<SentMessageRecord[]> {
  const records = readJson<SentMessageRecord[]>(SENT_MESSAGES_STORAGE_KEY, []);
  return [...records].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export async function getSentMessage(
  id: string
): Promise<SentMessageRecord | null> {
  const records = await listSentMessages();
  return records.find((record) => record.id === id) ?? null;
}

export async function sendMessage(
  data: MessageComposerData
): Promise<SentMessageRecord> {
  const normalized = normalizeComposerData(data);
  const record: SentMessageRecord = {
    ...normalized,
    id: createRecordId(),
    studentCount: normalized.studentIds.length,
    coachCount: normalized.coachIds.length,
    recipientCount: normalized.studentIds.length + normalized.coachIds.length,
    sentAt: new Date().toISOString(),
  };
  const records = await listSentMessages();
  writeJson(SENT_MESSAGES_STORAGE_KEY, [record, ...records]);
  return record;
}
