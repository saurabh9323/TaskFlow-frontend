"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import api from "@/lib/api";
import Navbar from "@/components/ui/Navbar";
import ProjectCard from "@/components/projects/ProjectCard";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { Plus, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";
import { isAuthenticated } from "@/lib/auth";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.replace("/login");
    }
  }, [authLoading, router]);

  useEffect(() => {
    if (!authLoading && user) {
      api.get<Project[]>("/projects/")
        .then(({ data }) => setProjects(data))
        .catch(() => toast.error("Failed to load projects"))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  if (authLoading || loading) return <><Navbar /><PageSpinner /></>;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-blue-600" />
              Projects
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          )}
        </div>

        {/* Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No projects yet</p>
            {isAdmin && (
              <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
                <Plus className="w-4 h-4" />
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(p) => setProjects((prev) => [p, ...prev])}
      />
    </>
  );
}
