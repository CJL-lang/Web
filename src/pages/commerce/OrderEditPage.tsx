import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { isPackageAvailable } from "../../mocks/packages";
import { OrderForm, type OrderFormPayload } from "./OrderForm";

export function OrderEditPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, packages, students, updateOrder } = useAdminData();

  const order = useMemo(
    () => (orderId ? orders.find((item) => item.id === orderId) : undefined),
    [orderId, orders],
  );
  const selectablePackages = useMemo(
    () =>
      packages.filter(
        (pkg) => isPackageAvailable(pkg) || pkg.id === order?.packageId,
      ),
    [order?.packageId, packages],
  );

  if (!orderId || !order) {
    return <Navigate replace to="/orders" />;
  }

  if (order.status !== "待完成" || order.closedAt) {
    return (
      <Navigate replace to={`/orders/${encodeURIComponent(order.id)}`} />
    );
  }

  const handleSubmit = (payload: OrderFormPayload) => {
    updateOrder(order.id, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    navigate(`/orders/${encodeURIComponent(order.id)}`);
  };

  return (
    <>
      <PageHeader eyebrow="Commerce" title="编辑订单" />

      <OrderForm
        cancelTo={`/orders/${encodeURIComponent(order.id)}`}
        initialOrder={order}
        onSubmit={handleSubmit}
        packages={selectablePackages}
        students={students}
        submitLabel="保存修改"
      />
    </>
  );
}
