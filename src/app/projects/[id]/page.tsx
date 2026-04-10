"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectDetail, Task } from "@/types";
import api from "@/lib/api";
import Navbar from "@/components/ui/Navbar";
import TaskBoard from "@/components/tasks/TaskBoard";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus, ArrowLeft, RefreshCw, ShieldAlert,
  CheckSquare, Clock, AlertCircle, ListChecks,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { isAuthenticated } from "@/lib/auth";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const { user, loading: authLoading, isAdmin } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [runningCheck, setRunningCheck] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated()) router.replace("/login");
  }, [authLoading, router]);

  const fetchProject = () => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api.get<ProjectDetail>(`/projects/${projectId}`),
      api.get<Task[]>(`/tasks/?project_id=${projectId}`),
    ])
      .then(([projRes, taskRes]) => {
        setProject(projRes.data);
        setTasks(taskRes.data);
      })
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading && user) fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const handleTaskUpdated = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleTaskDeleted = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const runOverdueCheck = async () => {
    setRunningCheck(true);
    try {
      const { data } = await api.post("/tasks/run-overdue-check");
      toast.success(data.message);
      fetchProject();
    } catch {
      toast.error("Overdue check failed");
    } finally {
      setRunningCheck(false);
    }
  };

  if (authLoading || loading) return <><Navbar /><PageSpinner /></>;
  if (!project) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-500">Project not found.</div>
    </>
  );

  // Stats
  const total   = tasks.length;
  const done    = tasks.filter((t) => t.status === "DONE").length;
  const wip     = tasks.filter((t) => t.status === "WIP").length;
  const overdue = tasks.filter((t) => t.status === "OVERDUE").length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total,   icon: ListChecks,  color: "text-gray-600 bg-gray-100" },
    { label: "In Progress", value: wip,  icon: Clock,    color: "text-blue-600 bg-blue-100" },
    { label: "Done",   value: done,    icon: CheckSquare, color: "text-green-600 bg-green-100" },
    { label: "Overdue",value: overdue, icon: AlertCircle, color: "text-red-600 bg-red-100" },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/projects" className="flex items-center gap-1 hover:text-blue-600 transition">
            <ArrowLeft className="w-4 h-4" /> Projects
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>

        {/* Project Header */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-gray-500 text-sm mt-1 max-w-2xl">{project.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created by <span className="font-medium">{project.owner.name}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <>
                  <button
                    onClick={runOverdueCheck}
                    disabled={runningCheck}
                    className="btn-secondary !text-orange-600 !border-orange-200 hover:!bg-orange-50"
                    title="Manually trigger overdue task detection"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    {runningCheck ? "Checking…" : "Overdue Check"}
                  </button>
                  <button
                    onClick={fetchProject}
                    className="btn-secondary"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowCreate(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Task Board</h2>
          <TaskBoard
            tasks={tasks}
            userRole={user!.role}
            onUpdated={handleTaskUpdated}
            onDeleted={handleTaskDeleted}
            onEdit={(t) => setEditTask(t)}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        projectId={projectId}
        onCreated={handleTaskCreated}
      />
      <EditTaskModal
        task={editTask}
        open={!!editTask}
        onClose={() => setEditTask(null)}
        onUpdated={handleTaskUpdated}
      />
    </>
  );
}
