import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSettingsTemplates } from "../../context/SettingsTemplateContext";
import type { CourseTemplate } from "../../mocks/templateSettings";

function formatCourseMeta(template: CourseTemplate) {
  return `${template.courseType} · ${template.defaultDurationMinutes} 分钟 · 最多 ${template.maxStudents} 人`;
}

export function CourseTemplateSettingsPage() {
  const navigate = useNavigate();
  const { courseTemplates, addCourseTemplate } = useSettingsTemplates();

  const templateTypeCount = useMemo(
    () => new Set(courseTemplates.map((item) => item.courseType)).size,
    [courseTemplates],
  );

  const handleAdd = () => {
    const newId = addCourseTemplate();
    void navigate(`/settings/courses/${newId}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates"
        title="课程模板设置"
        actions={
          <Link className="c-button-link-secondary c-template-editor-back-link" to="/settings">
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回设置
          </Link>
        }
      />

      <section aria-label="课程模板统计" className="c-template-editor-summary">
        <div className="c-template-editor-summary__item">
          <span className="c-template-editor-summary__label">课程模板</span>
          <strong className="c-template-editor-summary__value">
            {courseTemplates.length} 个
          </strong>
        </div>
        <div className="c-template-editor-summary__item">
          <span className="c-template-editor-summary__label">已覆盖类型</span>
          <strong className="c-template-editor-summary__value">
            {templateTypeCount} 类
          </strong>
        </div>
      </section>

      <div className="c-template-editor-form">
        <SectionCard
          eyebrow="Courses"
          title="课程模板"
          action={
            <Button
              className="c-template-editor-action-button"
              type="button"
              variant="secondary"
              onClick={handleAdd}
            >
              <Plus aria-hidden className="c-template-editor-action-icon" />
              添加课程模板
            </Button>
          }
        >
          {courseTemplates.length > 0 ? (
            <div className="c-template-editor-list">
              {courseTemplates.map((template, index) => (
                <article key={template.id} className="c-template-editor-item">
                  <Link
                    aria-label={`编辑课程模板：${template.name.trim() || "未命名课程模板"}`}
                    className="c-template-editor-item__toggle"
                    to={`/settings/courses/${template.id}`}
                  >
                    <div className="c-template-editor-item__title">
                      <span className="c-template-editor-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="c-template-editor-item__name">
                          {template.name.trim() || "未命名课程模板"}
                        </span>
                        <p className="c-template-editor-item__meta">
                          {formatCourseMeta(template)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      aria-hidden
                      className="c-template-editor-item__chevron"
                    />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="c-template-editor-empty">
              暂无课程模板，可点击“添加课程模板”创建。
            </p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
