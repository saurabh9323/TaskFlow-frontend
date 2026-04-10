"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import { Task, UserListOut, TaskPriority } from "@/types";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  due_date: z.string().min(1, "Due date is required"),
  assigned_to: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  onCreated: (task: Task) => void;
}

export default function CreateTaskModal({ open, onClose, projectId, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserListOut[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "MEDIUM" },
  });

  useEffect(() => {
    if (open) {
      api.get("/tasks/users/all").then(({ data }) => setUsers(data));
    }
  }, [open]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority as TaskPriority,
        due_date: new Date(values.due_date).toISOString(),
        project_id: projectId,
        assigned_to: values.assigned_to ? parseInt(values.assigned_to) : undefined,
      };
      const { data } = await api.post<Task>("/tasks/", payload);
      toast.success("Task created!");
      onCreated(data);
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <Modal open={open} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label">Title *</label>
          <input {...register("title")} className="input" placeholder="e.g. Design login page" />
          {errors.title && <p className="error-msg">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input resize-none"
            placeholder="Task details…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Priority *</label>
            <select {...register("priority")} className="input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="label">Due Date *</label>
            <input
              {...register("due_date")}
              type="date"
              min={todayStr}
              className="input"
            />
            {errors.due_date && <p className="error-msg">{errors.due_date.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Assign To</label>
          <select {...register("assigned_to")} className="input">
            <option value="">— Unassigned —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating…" : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
