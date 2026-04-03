"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AdminForm } from "./AdminForm";
import { adminService } from "@/services/admin.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

interface AdminsClientProps {
  initialAdmins: any[];
}

export const AdminsClient: React.FC<AdminsClientProps> = ({ initialAdmins }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [state, setState] = useState({
    admins: initialAdmins,
    isModalOpen: false,
    editingAdmin: null as any,
    isLoading: false,
    error: "",
    page: 1,
    limit: 6,
    total: 0,
  });

  const { admins, isModalOpen, editingAdmin, isLoading, error, page, limit } = state;

  const refreshAdmins = async (currentPage = page, search = debouncedSearch) => {
    try {
      const data = await adminService.getAllAdmins({ 
        page: currentPage, 
        limit: limit,
        search: search 
      });
      setState((prev) => ({ 
        ...prev, 
        admins: data.users || [],
        total: data.total || 0,
        page: currentPage
      }));
    } catch (err) {
      // Failed to load admins
    }
  };

  useEffect(() => {
    refreshAdmins(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleCreate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await adminService.createAdmin(data);
      await refreshAdmins();
      setState((prev) => ({ ...prev, isModalOpen: false }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to create admin",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await adminService.updateAdmin(editingAdmin._id, data);
      await refreshAdmins();
      setState((prev) => ({ ...prev, isModalOpen: false, editingAdmin: null }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to update admin",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete admin "${name}"?`)) return;

    try {
      await adminService.deleteAdmin(id);
      await refreshAdmins();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const openCreateModal = () => {
    setState((prev) => ({
      ...prev,
      editingAdmin: null,
      error: "",
      isModalOpen: true,
    }));
  };

  const openEditModal = (admin: any) => {
    setState((prev) => ({
      ...prev,
      editingAdmin: admin,
      error: "",
      isModalOpen: true,
    }));
  };

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Admins Management</h1>
            <p className="mt-2 text-slate-400">Manage administrative accounts and permissions.</p>
          </div>
          <Button onClick={openCreateModal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Admin
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <Card key={admin._id} className="hover:border-slate-700 transition-colors group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-xl border border-blue-500/20">
                    {admin.name.charAt(0)}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Administrator
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {admin.name}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{admin.email}</p>
                
                <div className="mt-8 flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => openEditModal(admin)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => handleDelete(admin._id, admin.name)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {admins.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500">No admins found.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {admins.length > 0 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshAdmins(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-slate-400 text-sm">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshAdmins(page + 1)}
              disabled={admins.length < limit}
            >
              Next
            </Button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setState((prev) => ({ ...prev, isModalOpen: false }))}
          title={editingAdmin ? "Edit Admin" : "Create New Admin"}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          <AdminForm
            initialData={editingAdmin}
            onSubmit={editingAdmin ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </RoleGuard>
  );
};
