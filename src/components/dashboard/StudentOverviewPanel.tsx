import type { StudentSummarySnapshot } from "../../types/dashboard";

interface StudentOverviewPanelProps {
  summary: StudentSummarySnapshot;
}

export function StudentOverviewPanel({
  summary,
}: StudentOverviewPanelProps) {
  return (
    <section
      className="c-student-kpi-strip"
      aria-label="学员核心指标"
    >
      <div className="c-student-kpi-strip__primary">
        <p className="c-student-kpi-strip__eyebrow">Students</p>
        <p className="c-student-kpi-strip__label">
          {summary.totalStudents.label}
        </p>
        <p className="c-student-kpi-strip__value c-student-kpi-strip__value--lead">
          {summary.totalStudents.value}
        </p>
      </div>

      {summary.businessMetrics.map((metric) => (
        <div className="c-student-kpi-strip__cell" key={metric.id}>
          <p className="c-student-kpi-strip__label">{metric.label}</p>
          <p className="c-student-kpi-strip__value">{metric.value}</p>
        </div>
      ))}
    </section>
  );
}
