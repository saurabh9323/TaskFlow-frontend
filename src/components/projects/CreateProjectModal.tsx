"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import api from "@/lib/api";
import { Project, CreateProjectPayload } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export default function CreateProjectModal({ open, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data } = await api.post<Project>("/projects/", values as CreateProjectPayload);
      toast.success("Project created!");
      onCreated(data);
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label">Project Name *</label>
          <input {...register("name")} className="input" placeholder="e.g. E-commerce Platform" />
          {errors.name && <p className="error-msg">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="input resize-none"
            placeholder="Brief description of the project…"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
