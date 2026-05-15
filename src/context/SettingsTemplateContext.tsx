import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  INITIAL_COURSE_TEMPLATES,
  INITIAL_HOMEWORK_TEMPLATES,
  INITIAL_TRAINING_PLAN_TEMPLATES,
  type CourseTemplate,
  type HomeworkTemplate,
  type TrainingPlanNodeTemplate,
  type TrainingPlanTemplate,
} from "../mocks/templateSettings";

function createCustomCourseTemplate(templates: CourseTemplate[]): CourseTemplate {
  const existingNames = new Set(templates.map((item) => item.name.trim()));
  let nextNumber = templates.length + 1;
  let nextName = `自定义课程模板 ${nextNumber}`;

  while (existingNames.has(nextName)) {
    nextNumber += 1;
    nextName = `自定义课程模板 ${nextNumber}`;
  }

  return {
    id: `custom-course-template-${Date.now()}`,
    name: nextName,
    courseType: "私教",
    defaultDurationMinutes: 60,
    maxStudents: 1,
    goal: "填写本节课程希望达成的教学目标。",
    focus: "填写本节课程的教学重点和训练安排。",
  };
}

function createCustomHomeworkTemplate(
  templates: HomeworkTemplate[],
): HomeworkTemplate {
  const existingTitles = new Set(templates.map((item) => item.title.trim()));
  let nextNumber = templates.length + 1;
  let nextTitle = `自定义作业模板 ${nextNumber}`;

  while (existingTitles.has(nextTitle)) {
    nextNumber += 1;
    nextTitle = `自定义作业模板 ${nextNumber}`;
  }

  return {
    id: `custom-homework-template-${Date.now()}`,
    title: nextTitle,
    description: "填写作业训练内容和完成方式。",
    points: 5,
    defaultDueDays: 3,
    submissionRequirement: "填写学员需要提交的图片、视频或文字记录要求。",
    gradingCriteria: "填写教练评分或反馈时关注的要点。",
  };
}

function createCustomPlanNode(
  template: Pick<TrainingPlanTemplate, "nodes" | "totalLessons">,
): TrainingPlanNodeTemplate {
  const existingTitles = new Set(template.nodes.map((item) => item.title.trim()));
  let nextNumber = template.nodes.length + 1;
  let nextTitle = `阶段 ${nextNumber}`;

  while (existingTitles.has(nextTitle)) {
    nextNumber += 1;
    nextTitle = `阶段 ${nextNumber}`;
  }

  const lastLessonEnd = Math.max(
    0,
    ...template.nodes.map((item) => item.lessonEnd),
  );
  const lessonStart = Math.min(template.totalLessons, lastLessonEnd + 1);
  const safeLessonStart = Math.max(1, lessonStart);

  return {
    id: `custom-plan-node-${Date.now()}`,
    title: nextTitle,
    lessonStart: safeLessonStart,
    lessonEnd: safeLessonStart,
    goal: "填写该阶段希望达成的训练目标。",
    focus: "填写该阶段的课程安排和训练重点。",
  };
}

function createCustomTrainingPlanTemplate(
  templates: TrainingPlanTemplate[],
): TrainingPlanTemplate {
  const existingNames = new Set(templates.map((item) => item.name.trim()));
  let nextNumber = templates.length + 1;
  let nextName = `自定义培养计划模板 ${nextNumber}`;

  while (existingNames.has(nextName)) {
    nextNumber += 1;
    nextName = `自定义培养计划模板 ${nextNumber}`;
  }

  const nextTemplate: TrainingPlanTemplate = {
    id: `custom-training-plan-template-${Date.now()}`,
    name: nextName,
    totalLessons: 8,
    applicableFor: "填写适用学员或适用套餐说明。",
    nodes: [],
  };

  return {
    ...nextTemplate,
    nodes: [createCustomPlanNode(nextTemplate)],
  };
}

export interface SettingsTemplateContextValue {
  courseTemplates: CourseTemplate[];
  homeworkTemplates: HomeworkTemplate[];
  trainingPlanTemplates: TrainingPlanTemplate[];
  updateCourseTemplate: (id: string, patch: Partial<CourseTemplate>) => void;
  addCourseTemplate: () => string;
  removeCourseTemplate: (id: string) => void;
  resetCourseTemplates: () => void;
  updateHomeworkTemplate: (
    id: string,
    patch: Partial<HomeworkTemplate>,
  ) => void;
  addHomeworkTemplate: () => string;
  removeHomeworkTemplate: (id: string) => void;
  resetHomeworkTemplates: () => void;
  updateTrainingPlanTemplate: (
    id: string,
    patch: Partial<Omit<TrainingPlanTemplate, "nodes">>,
  ) => void;
  updateTrainingPlanNode: (
    templateId: string,
    nodeId: string,
    patch: Partial<TrainingPlanNodeTemplate>,
  ) => void;
  addTrainingPlanTemplate: () => string;
  removeTrainingPlanTemplate: (id: string) => void;
  addTrainingPlanNode: (templateId: string) => void;
  removeTrainingPlanNode: (templateId: string, nodeId: string) => void;
  resetTrainingPlanTemplates: () => void;
}

const SettingsTemplateContext = createContext<SettingsTemplateContextValue | null>(
  null,
);

export function SettingsTemplateProvider({ children }: { children: ReactNode }) {
  const [courseTemplates, setCourseTemplates] = useState<CourseTemplate[]>(() =>
    structuredClone(INITIAL_COURSE_TEMPLATES),
  );
  const [homeworkTemplates, setHomeworkTemplates] = useState<HomeworkTemplate[]>(
    () => structuredClone(INITIAL_HOMEWORK_TEMPLATES),
  );
  const [trainingPlanTemplates, setTrainingPlanTemplates] = useState<
    TrainingPlanTemplate[]
  >(() => structuredClone(INITIAL_TRAINING_PLAN_TEMPLATES));

  const updateCourseTemplate = useCallback((id: string, patch: Partial<CourseTemplate>) => {
    setCourseTemplates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const addCourseTemplate = useCallback((): string => {
    let newId = "";
    setCourseTemplates((prev) => {
      const nextTemplate = createCustomCourseTemplate(prev);
      newId = nextTemplate.id;
      return [...prev, nextTemplate];
    });
    return newId;
  }, []);

  const removeCourseTemplate = useCallback((id: string) => {
    setCourseTemplates((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetCourseTemplates = useCallback(() => {
    setCourseTemplates(structuredClone(INITIAL_COURSE_TEMPLATES));
  }, []);

  const updateHomeworkTemplate = useCallback(
    (id: string, patch: Partial<HomeworkTemplate>) => {
      setHomeworkTemplates((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const addHomeworkTemplate = useCallback((): string => {
    let newId = "";
    setHomeworkTemplates((prev) => {
      const nextTemplate = createCustomHomeworkTemplate(prev);
      newId = nextTemplate.id;
      return [...prev, nextTemplate];
    });
    return newId;
  }, []);

  const removeHomeworkTemplate = useCallback((id: string) => {
    setHomeworkTemplates((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetHomeworkTemplates = useCallback(() => {
    setHomeworkTemplates(structuredClone(INITIAL_HOMEWORK_TEMPLATES));
  }, []);

  const updateTrainingPlanTemplate = useCallback(
    (
      id: string,
      patch: Partial<Omit<TrainingPlanTemplate, "nodes">>,
    ) => {
      setTrainingPlanTemplates((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const updateTrainingPlanNode = useCallback(
    (
      templateId: string,
      nodeId: string,
      patch: Partial<TrainingPlanNodeTemplate>,
    ) => {
      setTrainingPlanTemplates((prev) =>
        prev.map((template) =>
          template.id === templateId
            ? {
                ...template,
                nodes: template.nodes.map((node) =>
                  node.id === nodeId ? { ...node, ...patch } : node,
                ),
              }
            : template,
        ),
      );
    },
    [],
  );

  const addTrainingPlanTemplate = useCallback((): string => {
    let newId = "";
    setTrainingPlanTemplates((prev) => {
      const nextTemplate = createCustomTrainingPlanTemplate(prev);
      newId = nextTemplate.id;
      return [...prev, nextTemplate];
    });
    return newId;
  }, []);

  const removeTrainingPlanTemplate = useCallback((id: string) => {
    setTrainingPlanTemplates((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addTrainingPlanNode = useCallback((templateId: string) => {
    setTrainingPlanTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? {
              ...template,
              nodes: [...template.nodes, createCustomPlanNode(template)],
            }
          : template,
      ),
    );
  }, []);

  const removeTrainingPlanNode = useCallback((templateId: string, nodeId: string) => {
    setTrainingPlanTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? {
              ...template,
              nodes: template.nodes.filter((node) => node.id !== nodeId),
            }
          : template,
      ),
    );
  }, []);

  const resetTrainingPlanTemplates = useCallback(() => {
    setTrainingPlanTemplates(structuredClone(INITIAL_TRAINING_PLAN_TEMPLATES));
  }, []);

  const value = useMemo(
    () =>
      ({
        courseTemplates,
        homeworkTemplates,
        trainingPlanTemplates,
        updateCourseTemplate,
        addCourseTemplate,
        removeCourseTemplate,
        resetCourseTemplates,
        updateHomeworkTemplate,
        addHomeworkTemplate,
        removeHomeworkTemplate,
        resetHomeworkTemplates,
        updateTrainingPlanTemplate,
        updateTrainingPlanNode,
        addTrainingPlanTemplate,
        removeTrainingPlanTemplate,
        addTrainingPlanNode,
        removeTrainingPlanNode,
        resetTrainingPlanTemplates,
      }) satisfies SettingsTemplateContextValue,
    [
      courseTemplates,
      homeworkTemplates,
      trainingPlanTemplates,
      updateCourseTemplate,
      addCourseTemplate,
      removeCourseTemplate,
      resetCourseTemplates,
      updateHomeworkTemplate,
      addHomeworkTemplate,
      removeHomeworkTemplate,
      resetHomeworkTemplates,
      updateTrainingPlanTemplate,
      updateTrainingPlanNode,
      addTrainingPlanTemplate,
      removeTrainingPlanTemplate,
      addTrainingPlanNode,
      removeTrainingPlanNode,
      resetTrainingPlanTemplates,
    ],
  );

  return (
    <SettingsTemplateContext.Provider value={value}>
      {children}
    </SettingsTemplateContext.Provider>
  );
}

export function useSettingsTemplates() {
  const ctx = useContext(SettingsTemplateContext);
  if (ctx == null) {
    throw new Error(
      "useSettingsTemplates must be used within SettingsTemplateProvider",
    );
  }
  return ctx;
}
