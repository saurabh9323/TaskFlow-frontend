"use client";
import { useState } from "react";
import { Task, TaskStatus, UserRole } from "@/types";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import { format, isPast } from "date-fns";
import { Calendar, User, AlertCircle, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import api from "@/lib/api";
import toast from "react-hot-toast";

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO:    ["WIP"],
  WIP:     ["TODO", "DONE"],
  DONE:    [],
  OVERDUE: ["DONE"],
};

interface Props {
  task: Task;
  userRole: UserRole;
  onUpdated: (t: Task) => void;
  onDeleted: (id: number) => void;
  onEdit: (t: Task) => void;
}

export default function TaskCard({ task, userRole, onUpdated, onDeleted, onEdit }: Props) {
  const [loading, setLoading] = useState(false);
  const isAdmin = userRole === "admin";
  const dueDate = new Date(task.due_date);
  const isOverdue = task.status === "OVERDUE";
  const duePast = isPast(dueDate) && task.status !== "DONE";

  const nextStatuses = STATUS_TRANSITIONS[task.status] ?? [];
  // If overdue and not admin, filter out DONE
  const allowedNext = isOverdue && !isAdmin
    ? nextStatuses.filter((s) => s !== "DONE")
    : nextStatuses;

  const changeStatus = async (newStatus: TaskStatus) => {
    setLoading(true);
    try {
      const { data } = await api.put<Task>(`/tasks/${task.id}`, { status: newStatus });
      onUpdated(data);
      toast.success(`Status → ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      onDeleted(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className={clsx(
      "card p-4 flex flex-col gap-3 transition",
      isOverdue && "border-red-200 bg-red-50/30",
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1">{task.title}</h4>
        {isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              title="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={deleteTask}
              className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 text-xs text-gray-500">
        <span className={clsx("flex items-center gap-1", duePast && "text-red-500 font-medium")}>
          {duePast && <AlertCircle className="w-3.5 h-3.5" />}
          <Calendar className="w-3.5 h-3.5" />
          Due {format(dueDate, "MMM d, yyyy")}
        </span>
        {task.assignee && (
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {task.assignee.name}
          </span>
        )}
      </div>

      {/* Status Transitions */}
      {allowedNext.length > 0 && (
        <div className="flex gap-2 pt-1 flex-wrap">
          {allowedNext.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={loading}
              className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition disabled:opacity-50"
            >
              → {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
