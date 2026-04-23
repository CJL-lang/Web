import { Download, Plus, Search } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";

const students = [
  {
    id: "ST-1024",
    name: "林嘉禾",
    status: "进行中",
    coach: "陈教练",
    packageName: "青少年进阶课",
  },
  {
    id: "ST-1028",
    name: "赵以宁",
    status: "待回访",
    coach: "王教练",
    packageName: "成人入门体验",
  },
  {
    id: "ST-1035",
    name: "周亦晨",
    status: "续费中",
    coach: "刘教练",
    packageName: "私教强化包",
  },
  {
    id: "ST-1042",
    name: "陈语桐",
    status: "暂停",
    coach: "黄教练",
    packageName: "基础挥杆训练",
  },
];

export function StudentsPage() {
  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        actions={
          <>
            <Button variant="secondary">
              <span className="inline-flex items-center gap-2">
                <Download size={16} />
                导出
              </span>
            </Button>
            <Button>
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                新建学员
              </span>
            </Button>
          </>
        }
        description="列表型页面统一采用‘标题区 + 过滤条 + 响应式行项’结构，在 iPad 横屏时继续保持可读，不强行塞桌面表格。"
        eyebrow="Students"
        title="学员管理"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] md:p-5">
          <p className="text-sm text-[var(--color-text-muted)]">活跃学员</p>
          <p className="mt-2 text-[1.9rem] font-semibold tracking-tight text-[var(--color-text-primary)]">
            864
          </p>
        </div>
        <div className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] md:p-5">
          <p className="text-sm text-[var(--color-text-muted)]">待回访</p>
          <p className="mt-2 text-[1.9rem] font-semibold tracking-tight text-[var(--color-text-primary)]">
            29
          </p>
        </div>
        <div className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] md:p-5 md:col-span-2 xl:col-span-1">
          <p className="text-sm text-[var(--color-text-muted)]">本周到课率</p>
          <p className="mt-2 text-[1.9rem] font-semibold tracking-tight text-[var(--color-text-primary)]">
            91%
          </p>
        </div>
      </section>

      <SectionCard
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">
              <span className="inline-flex items-center gap-2">
                <Search size={16} />
                搜索位
              </span>
            </Button>
            <Button variant="ghost">状态筛选</Button>
          </div>
        }
        description="在中等宽度下，列表行会先折成信息卡；到更宽屏幕时再恢复成多列对齐。"
        title="学员列表"
      >
        <div className="space-y-3">
          <div className="hidden rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] lg:grid lg:grid-cols-[minmax(0,1.35fr)_140px_140px_160px] lg:gap-4">
            <span>学员</span>
            <span>状态</span>
            <span>负责教练</span>
            <span>课程包</span>
          </div>

          {students.map((student) => (
            <article
              key={student.id}
              className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-4"
            >
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_140px_140px_160px] lg:items-center">
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[var(--color-text-primary)]">
                    {student.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    编号 {student.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] lg:hidden">
                    状态
                  </p>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {student.status}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] lg:hidden">
                    负责教练
                  </p>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {student.coach}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)] lg:hidden">
                    课程包
                  </p>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {student.packageName}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
