"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/auth.service";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    // Clear session on login page load
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);
      
      // Store in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      switch (response.user.role) {
        case UserRole.SUPER_ADMIN:
          router.push("/dashboard/super-admin/admins");
          break;
        case UserRole.ADMIN:
          router.push("/dashboard/admin/users");
          break;
        case UserRole.USER:
          router.push("/dashboard/user/tasks");
          break;
        default:
          setError("Access denied: Invalid user role.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="mesh-bg" />
      <div className="glow-point top-[-10%] right-[-10%]" />
      <div className="glow-point bottom-[-10%] left-[-10%]" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="glass-card rounded-[2.5rem] overflow-hidden p-8 sm:p-12 shadow-2xl shadow-black/50 border border-white/5">
          {/* Logo / Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-6 shadow-2xl shadow-blue-500/40 transform hover:rotate-12 transition-transform cursor-default font-black italic text-white text-3xl">
              E
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-3 uppercase">
              EBANI TECH <span className="text-blue-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 font-medium font-outfit uppercase tracking-tighter">Manage your enterprise ecosystem</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-outfit"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-5 h-5 transition-transform group-focus-within:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-outfit"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg className="w-5 h-5 transition-transform group-focus-within:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl text-center font-bold animate-shake uppercase tracking-tight">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-md font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/60 transition-all cursor-pointer"
              isLoading={loading}
            >
              Authenticate & Enter
            </Button>
          </form>

          <div className="mt-10 text-center animate-bounce-slow">
            <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">
              DONE BY ROHITH
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2 opacity-50">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">
                EBANI TECH RBAC V1.0
              </p>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

