import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/components/ui/table";
import { Input } from "src/components/components/ui/input";
import { Button } from "src/components/components/ui/button";
import { Textarea } from "src/components/components/ui/textarea";
import Pagination from "src/components/components/ui/pagination";
import { FaSearch } from "react-icons/fa";
import TotalLoad from "src/components/components/totalLoad";
import useRoleStore from "src/store/roleStore";
import { joinUrlWithParamsId } from "src/helpers/helpers";
import TMModal from "src/components/components/ui/TM_Modal";
import type { Role } from "src/types/admin";

const PAGE_SIZE = 7;

const AdminRoles = () => {
  const navigate = useNavigate();
  const {
    roles,
    loadingRoles,
    loadingRoleMutation,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    error,
  } = useRoleStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchRoles({ page, limit: PAGE_SIZE, q: debouncedSearch || undefined });
  }, [page, debouncedSearch, fetchRoles]);

  const totalPages = useMemo(() => {
    const total = pagination?.total || roles.length || 1;
    const limit = pagination?.limit || PAGE_SIZE;
    return Math.max(1, Math.ceil(total / limit));
  }, [pagination, roles.length]);

  if (loadingRoles) {
    return <TotalLoad />;
  }

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEditModal = (role: Role) => {
    setFormName(role.name || "");
    setFormDescription(role.description || "");
    setFormError(null);
    setEditRole(role);
  };

  const handleSaveCreate = async () => {
    if (formName.trim().length < 2) {
      setFormError("Le nom du rôle est requis (min 2 caractères).");
      return;
    }
    const created = await createRole({
      name: formName.trim(),
      description: formDescription.trim() || undefined,
    });
    if (created) {
      setCreateOpen(false);
      resetForm();
    }
  };

  const handleSaveEdit = async () => {
    if (!editRole) return;
    if (formName.trim().length < 2) {
      setFormError("Le nom du rôle est requis (min 2 caractères).");
      return;
    }
    const updated = await updateRole(editRole.roleId, {
      name: formName.trim(),
      description: formDescription.trim() || undefined,
    });
    if (updated) {
      setEditRole(null);
      resetForm();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteRole(deleteTarget.roleId);
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Rôles</h1>
        <div className="flex items-center gap-2">
          <Button
            className="bg-primary text-white"
            onClick={openCreateModal}
          >
            + Ajouter un rôle
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border border-gray-200 p-3 bg-white">
        <div className="relative w-full md:w-1/2">
          <Input
            placeholder="Rechercher un rôle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.roleId}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(
                        joinUrlWithParamsId("/admin/roles/:id", role.roleId)
                      )
                    }
                  >
                    Détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(role)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteTarget(role)}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-white">
          <TableRow>
            <TableCell colSpan={3}>
              <div className="flex justify-center my-4">
                <Pagination
                  pages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  rangeLimit={5}
                />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <TMModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Créer un rôle"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom du rôle</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="MANAGE_PATIENT"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Description du rôle"
              className="min-h-[100px]"
            />
          </div>
          {formError && <div className="text-sm text-red-600">{formError}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handleSaveCreate}
              disabled={loadingRoleMutation}
            >
              {loadingRoleMutation ? "Création..." : "Créer"}
            </Button>
          </div>
        </div>
      </TMModal>

      <TMModal
        isOpen={Boolean(editRole)}
        onClose={() => setEditRole(null)}
        title="Modifier le rôle"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom du rôle</label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="MANAGE_PATIENT"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Description du rôle"
              className="min-h-[100px]"
            />
          </div>
          {formError && <div className="text-sm text-red-600">{formError}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditRole(null)}>
              Annuler
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handleSaveEdit}
              disabled={loadingRoleMutation}
            >
              {loadingRoleMutation ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </div>
      </TMModal>

      <TMModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer le rôle"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Confirmer la suppression du rôle{" "}
            <span className="font-semibold">{deleteTarget?.name}</span> ?
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleConfirmDelete}
              disabled={loadingRoleMutation}
            >
              {loadingRoleMutation ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </div>
      </TMModal>
    </div>
  );
};

export default AdminRoles;
