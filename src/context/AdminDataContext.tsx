import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  INITIAL_COURSE_OPENING_GROUPS,
  type CourseOpeningGroup,
} from "../mocks/courseOpenings";
import {
  INITIAL_COACH_LIST,
  type CoachListItem,
} from "../mocks/coaches";
import {
  INITIAL_ORDER_LIST,
  type OrderListItem,
} from "../mocks/orders";
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
  orders: OrderListItem[];
  courseOpeningGroups: CourseOpeningGroup[];
  addStudent: (item: StudentListItem) => void;
  addCoach: (item: CoachListItem) => void;
  addPackage: (item: PackageListItem) => void;
  updatePackage: (id: string, next: Omit<PackageListItem, "id">) => void;
  addOrder: (item: OrderListItem) => void;
  updateOrder: (
    id: string,
    next: Omit<OrderListItem, "id" | "createdAt">,
  ) => void;
  closeOrder: (id: string) => void;
  addCourseOpeningGroup: (item: CourseOpeningGroup) => void;
  appendOrdersToCourseOpeningGroup: (id: string, orderIds: string[]) => void;
  confirmCourseOpeningGroup: (id: string) => void;
  reassignCourseOpeningGroupCoach: (id: string, coachId: string) => void;
  deleteCourseOpeningGroup: (id: string) => void;
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
  const [orders, setOrders] = useState<OrderListItem[]>(() =>
    structuredClone(INITIAL_ORDER_LIST)
  );
  const [courseOpeningGroups, setCourseOpeningGroups] = useState<
    CourseOpeningGroup[]
  >(() => structuredClone(INITIAL_COURSE_OPENING_GROUPS));

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

  const addOrder = useCallback((item: OrderListItem) => {
    setOrders((prev) => [...prev, item]);
  }, []);

  const updateOrder = useCallback(
    (id: string, next: Omit<OrderListItem, "id" | "createdAt">) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, ...next, id: order.id, createdAt: order.createdAt }
            : order,
        ),
      );
    },
    [],
  );

  const closeOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) {
          return order;
        }

        const now = new Date().toISOString();
        return { ...order, closedAt: now, updatedAt: now };
      }),
    );
  }, []);

  const addCourseOpeningGroup = useCallback((item: CourseOpeningGroup) => {
    setCourseOpeningGroups((prev) => [...prev, item]);
  }, []);

  const appendOrdersToCourseOpeningGroup = useCallback(
    (id: string, orderIds: string[]) => {
      setCourseOpeningGroups((prev) =>
        prev.map((group) => {
          if (group.id !== id) {
            return group;
          }

          const nextOrderIds = Array.from(
            new Set([...group.orderIds, ...orderIds]),
          );
          return {
            ...group,
            orderIds: nextOrderIds,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  const confirmCourseOpeningGroup = useCallback((id: string) => {
    setCourseOpeningGroups((prev) =>
      prev.map((group) =>
        group.id === id
          ? { ...group, status: "已开课", updatedAt: new Date().toISOString() }
          : group,
      ),
    );
  }, []);

  const reassignCourseOpeningGroupCoach = useCallback(
    (id: string, coachId: string) => {
      setCourseOpeningGroups((prev) =>
        prev.map((group) =>
          group.id === id
            ? { ...group, coachId, updatedAt: new Date().toISOString() }
            : group,
        ),
      );
    },
    [],
  );

  const deleteCourseOpeningGroup = useCallback((id: string) => {
    setCourseOpeningGroups((prev) => prev.filter((group) => group.id !== id));
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        students,
        coaches,
        packages,
        orders,
        courseOpeningGroups,
        addStudent,
        addCoach,
        addPackage,
        updatePackage,
        addOrder,
        updateOrder,
        closeOrder,
        addCourseOpeningGroup,
        appendOrdersToCourseOpeningGroup,
        confirmCourseOpeningGroup,
        reassignCourseOpeningGroupCoach,
        deleteCourseOpeningGroup,
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
