"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { login } from "@/lib/auth";
import { Eye, EyeOff, LogIn } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await login(values);
      toast.success("Welcome back!");
      router.push("/projects");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Login failed. Check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="label">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
              {errors.email && <p className="error-msg">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-600">Test Credentials</p>
            <p>Admin → <span className="font-mono">admin@demo.com</span> / <span className="font-mono">admin123</span></p>
            <p>Member → <span className="font-mono">member@demo.com</span> / <span className="font-mono">member123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
