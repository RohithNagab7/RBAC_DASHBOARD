"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        // Not authorized, redirect to their home or a forbidden page
        setAuthorized(false);
        alert("Access Denied: You do not have permission to view this page.");
        
        // Simple redirection based on their role
        switch (user.role) {
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
            router.push("/login");
        }
      } else {
        setAuthorized(true);
      }
    } catch (error) {
      router.push("/login");
    }
  }, [allowedRoles, router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <p>Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
};
