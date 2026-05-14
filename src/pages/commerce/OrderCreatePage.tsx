import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { isPackageAvailable } from "../../mocks/packages";
import { nextOrderId } from "../../utils/adminIds";
import { OrderForm, type OrderFormPayload } from "./OrderForm";

export function OrderCreatePage() {
  const navigate = useNavigate();
  const { addOrder, orders, packages, students } = useAdminData();
  const availablePackages = useMemo(
    () => packages.filter(isPackageAvailable),
    [packages]
  );

  const handleSubmit = (payload: OrderFormPayload) => {
    const now = new Date().toISOString();
    addOrder({
      id: nextOrderId(orders),
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
    navigate("/orders");
  };

  return (
    <>
      <PageHeader eyebrow="Commerce" title="新增订单" />

      <OrderForm
        cancelTo="/orders"
        onSubmit={handleSubmit}
        packages={availablePackages}
        students={students}
        submitLabel="保存订单"
      />
    </>
  );
}
