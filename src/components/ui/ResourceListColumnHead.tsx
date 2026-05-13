import { cn } from "../../utils/cn";

export type ResourceListColumnHeadColumn =
  | {
      key: string;
      variant: "primary";
      label: string;
    }
  | {
      key: string;
      variant: "stat";
      label: string;
      labelStrong?: boolean;
      className?: string;
    };

export function ResourceListColumnHead({
  className,
  columns,
}: {
  className?: string;
  columns: ResourceListColumnHeadColumn[];
}) {
  return (
    <div className={cn("c-resource-list__column-head", className)}>
      {columns.map((col) => {
        if (col.variant === "primary") {
          return (
            <div key={col.key} className="c-resource-list__column-head-primary">
              <p className="c-resource-list__stat-label">{col.label}</p>
            </div>
          );
        }
        const labelClass = col.labelStrong
          ? "c-resource-list__stat-label--strong"
          : "c-resource-list__stat-label";
        return (
          <div
            key={col.key}
            className={cn(
              "c-resource-list__stat c-resource-list__column-head-stat",
              col.className,
            )}
          >
            <p className={labelClass}>{col.label}</p>
          </div>
        );
      })}
    </div>
  );
}
