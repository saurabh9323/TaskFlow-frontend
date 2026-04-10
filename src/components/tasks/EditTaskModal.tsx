"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import { Task, UserListOut, TaskPriority, TaskStatus } from "@/types";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  due_date: z.string().min(1),
  assigned_to: z.string().optional(),
  status: z.enum(["TODO", "WIP", "DONE", "OVERDUE"]),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (t: Task) => void;
}

export default function EditTaskModal({ task, open, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserListOut[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        due_date: format(new Date(task.due_date), "yyyy-MM-dd"),
        assigned_to: task.assigned_to?.toString() || "",
        status: task.status,
      });
      api.get("/tasks/users/all").then(({ data }) => setUsers(data));
    }
  }, [open, task, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!task) return;
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority as TaskPriority,
        status: values.status as TaskStatus,
        due_date: new Date(values.due_date).toISOString(),
        assigned_to: values.assigned_to ? parseInt(values.assigned_to) : undefined,
      };
      const { data } = await api.put<Task>(`/tasks/${task.id}`, payload);
      toast.success("Task updated!");
      onUpdated(data);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Task" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label">Title *</label>
          <input {...register("title")} className="input" />
          {errors.title && <p className="error-msg">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register("description")} rows={3} className="input resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Priority</label>
            <select {...register("priority")} className="input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register("status")} className="input">
              <option value="TODO">To Do</option>
              <option value="WIP">In Progress</option>
              <option value="DONE">Done</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Due Date *</label>
            <input {...register("due_date")} type="date" className="input" />
            {errors.due_date && <p className="error-msg">{errors.due_date.message}</p>}
          </div>
          <div>
            <label className="label">Assign To</label>
            <select {...register("assigned_to")} className="input">
              <option value="">— Unassigned —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
