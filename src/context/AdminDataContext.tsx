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
  addStudent: (item: StudentListItem) => void;
  addCoach: (item: CoachListItem) => void;
  addPackage: (item: PackageListItem) => void;
  updatePackage: (id: string, next: Omit<PackageListItem, "id">) => void;
  addOrder: (item: OrderListItem) => void;
  updateOrder: (
    id: string,
    next: Omit<OrderListItem, "id" | "createdAt">,
  ) => void;
  cancelOrder: (id: string) => void;
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

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: "已取消", updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        students,
        coaches,
        packages,
        orders,
        addStudent,
        addCoach,
        addPackage,
        updatePackage,
        addOrder,
        updateOrder,
        cancelOrder,
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
