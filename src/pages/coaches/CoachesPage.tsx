import { BriefcaseBusiness } from "lucide-react";

import { PageScaffold } from "../../components/ui/PageScaffold";

export function CoachesPage() {
  return (
    <PageScaffold
      badge="Coaches"
      description="先把列表、排班和详情区域挂在统一响应式骨架下，后续可以继续补教练档案与带课状态。"
      emptyDescription="当前页保留为骨架版本，后续可以直接替换成真实的教练列表、排班视图和详情区。"
      emptyTitle="教练管理骨架已准备好"
      eyebrow="Coaches"
      icon={BriefcaseBusiness}
      modules={["教练列表", "排班总览", "详情侧栏"]}
      title="教练管理"
    />
  );
}
