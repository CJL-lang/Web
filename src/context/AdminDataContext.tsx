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
  INITIAL_PACKAGE_LIST,
  type PackageListItem,
} from "../mocks/packages";
import {
  INITIAL_STUDENT_LIST,
  normalizeStudentListItem,
  type StudentListItem,
} from "../mocks/students";

export interface AdminDataContextValue {
  students: StudentListItem[];
  coaches: CoachListItem[];
  packages: PackageListItem[];
  addStudent: (item: StudentListItem) => void;
  addCoach: (item: CoachListItem) => void;
  addPackage: (item: PackageListItem) => void;
  updatePackage: (id: string, next: Omit<PackageListItem, "id">) => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentListItem[]>(() =>
    structuredClone(INITIAL_STUDENT_LIST).map(normalizeStudentListItem)
  );
  const [coaches, setCoaches] = useState<CoachListItem[]>(() =>
    structuredClone(INITIAL_COACH_LIST)
  );
  const [packages, setPackages] = useState<PackageListItem[]>(() =>
    structuredClone(INITIAL_PACKAGE_LIST)
  );

  const addStudent = useCallback((item: StudentListItem) => {
    setStudents((prev) => [...prev, normalizeStudentListItem(item)]);
  }, []);

  const addCoach = useCallback((item: CoachListItem) => {
    setCoaches((prev) => [...prev, item]);
  }, []);

  const addPackage = useCallback((item: PackageListItem) => {
    setPackages((prev) => [...prev, item]);
  }, []);

  const updatePackage = useCallback(
    (id: string, next: Omit<PackageListItem, "id">) => {
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...next } : p))
      );
    },
    []
  );

  return (
    <AdminDataContext.Provider
      value={{
        students,
        coaches,
        packages,
        addStudent,
        addCoach,
        addPackage,
        updatePackage,
      }}
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
