import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  INITIAL_COACH_LIST,
  type CoachListItem,
} from "../mocks/coaches";
import {
  INITIAL_STUDENT_LIST,
  type StudentListItem,
} from "../mocks/students";

export interface AdminDataContextValue {
  students: StudentListItem[];
  coaches: CoachListItem[];
  addStudent: (item: StudentListItem) => void;
  addCoach: (item: CoachListItem) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentListItem[]>(() =>
    structuredClone(INITIAL_STUDENT_LIST)
  );
  const [coaches, setCoaches] = useState<CoachListItem[]>(() =>
    structuredClone(INITIAL_COACH_LIST)
  );

  const addStudent = useCallback((item: StudentListItem) => {
    setStudents((prev) => [...prev, item]);
  }, []);

  const addCoach = useCallback((item: CoachListItem) => {
    setCoaches((prev) => [...prev, item]);
  }, []);

  return (
    <AdminDataContext.Provider
      value={{ students, coaches, addStudent, addCoach }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}
