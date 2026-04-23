import { SlidersHorizontal } from "lucide-react";

import { PageScaffold } from "../../components/ui/PageScaffold";

export function SettingsPage() {
  return (
    <PageScaffold
      badge="Settings"
      description="设置页先验证分组面板、表单段落和说明区在中等宽度下的排列方式，再逐项补具体配置。"
      emptyDescription="当前页先保留可扩展骨架，后续可在此接学院信息、消息模板、权限和系统偏好。"
      emptyTitle="设置页骨架已建立"
      eyebrow="Settings"
      icon={SlidersHorizontal}
      modules={["基础信息", "消息模板", "运营偏好"]}
      title="设置"
    />
  );
}
