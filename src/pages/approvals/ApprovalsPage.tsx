import { CheckCheck } from "lucide-react";

import { PageScaffold } from "../../components/ui/PageScaffold";

export function ApprovalsPage() {
  return (
    <PageScaffold
      badge="Approvals"
      description="审批类页面先走统一的‘筛选 + 列表 + 详情’骨架，确保 iPad 横屏下也能完整浏览待处理事项。"
      emptyDescription="当前页保留为结构样板，后续可直接补入审批列表、状态流和操作面板。"
      emptyTitle="审批骨架已搭好"
      eyebrow="Approvals"
      icon={CheckCheck}
      modules={["待处理列表", "状态筛选", "申请详情"]}
      title="批准申请"
    />
  );
}
