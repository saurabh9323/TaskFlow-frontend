import clsx from "clsx";
import { TaskStatus, TaskPriority } from "@/types";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO:    { label: "To Do",    className: "bg-gray-100 text-gray-700" },
  WIP:     { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  DONE:    { label: "Done",     className: "bg-green-100 text-green-700" },
  OVERDUE: { label: "Overdue",  className: "bg-red-100 text-red-700" },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW:    { label: "Low",    className: "bg-slate-100 text-slate-600" },
  MEDIUM: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  HIGH:   { label: "High",   className: "bg-orange-100 text-orange-700" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.TODO;
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.className)}>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = priorityConfig[priority] ?? priorityConfig.MEDIUM;
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.className)}>
      {cfg.label}
    </span>
  );
}
