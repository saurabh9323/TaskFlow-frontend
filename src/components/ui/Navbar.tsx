"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/projects" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
            <LayoutDashboard className="w-5 h-5" />
            TaskFlow
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/projects"
              className={clsx(
                "text-sm font-medium transition",
                pathname.startsWith("/projects") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              )}
            >
              Projects
            </Link>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.name}
                </span>
                <span
                  className={clsx(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  )}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="btn-secondary !px-3 !py-1.5 text-xs"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
