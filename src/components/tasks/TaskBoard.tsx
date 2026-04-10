"use client";
import { Task, TaskStatus, UserRole } from "@/types";
import TaskCard from "./TaskCard";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO",    label: "To Do",       color: "border-t-gray-400" },
  { status: "WIP",     label: "In Progress", color: "border-t-blue-500" },
  { status: "DONE",    label: "Done",        color: "border-t-green-500" },
  { status: "OVERDUE", label: "Overdue",     color: "border-t-red-500" },
];

interface Props {
  tasks: Task[];
  userRole: UserRole;
  onUpdated: (t: Task) => void;
  onDeleted: (id: number) => void;
  onEdit: (t: Task) => void;
}

export default function TaskBoard({ tasks, userRole, onUpdated, onDeleted, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">No tasks yet</p>
        <p className="text-sm">Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map(({ status, label, color }) => {
        const col = tasks.filter((t) => t.status === status);
        return (
          <div key={status} className={`card border-t-4 ${color} flex flex-col`}>
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{label}</span>
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">
                {col.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-3 p-3 flex-1 min-h-[120px]">
              {col.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
              )}
              {col.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userRole={userRole}
                  onUpdated={onUpdated}
                  onDeleted={onDeleted}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
