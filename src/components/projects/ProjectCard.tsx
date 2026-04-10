import Link from "next/link";
import { Project } from "@/types";
import { format } from "date-fns";
import { CheckSquare, ArrowRight, Calendar } from "lucide-react";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="card p-5 transition hover:shadow-md hover:border-blue-200 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 flex-1">
            {project.name}
          </h3>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition shrink-0 mt-0.5" />
        </div>

        {project.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{project.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5" />
            {project.task_count} task{project.task_count !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(project.created_at), "MMM d, yyyy")}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          By {project.owner.name}
        </div>
      </div>
    </Link>
  );
}
