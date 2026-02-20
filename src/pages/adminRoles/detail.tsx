import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/components/ui/card";
import { Button } from "src/components/components/ui/button";
import { Input } from "src/components/components/ui/input";
import { Checkbox } from "src/components/components/ui/checkbox";
import Pagination from "src/components/components/ui/pagination";
import TotalLoad from "src/components/components/totalLoad";
import useRoleStore from "src/store/roleStore";
import usePermissionStore from "src/store/permissionStore";

const PAGE_SIZE = 10;

const RoleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    selectedRole,
    rolePermissions,
    loadingRoleDetail,
    loadingRolePermissions,
    loadingPermissionUpdate,
    fetchRoleById,
    fetchRolePermissions,
    assignPermissions,
    removePermissions,
    error,
  } = useRoleStore();

  const {
    permissions,
    pagination,
    loading,
    fetchPermissions,
  } = usePermissionStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedToAssign, setSelectedToAssign] = useState<number[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      fetchRoleById(id);
      fetchRolePermissions(id);
    }
  }, [id, fetchRoleById, fetchRolePermissions]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchPermissions({
      search: debouncedSearch || undefined,
      page,
      limit: PAGE_SIZE,
    });
  }, [debouncedSearch, page, fetchPermissions]);

  const assignedIds = useMemo(
    () => new Set(rolePermissions.map((p) => p.permissionId)),
    [rolePermissions]
  );

  const totalPages = useMemo(() => {
    const total = pagination?.total || permissions.length || 1;
    const limit = pagination?.limit || PAGE_SIZE;
    return Math.max(1, Math.ceil(total / limit));
  }, [pagination, permissions.length]);

  if (loadingRoleDetail || loadingRolePermissions) {
    return <TotalLoad />;
  }

  if (!selectedRole) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-600">Rôle introuvable.</div>
      </div>
    );
  }

  const handleAssign = async () => {
    if (!id || selectedToAssign.length === 0) return;
    const permissionObjects = permissions.filter((p) =>
      selectedToAssign.includes(p.permissionId)
    );
    await assignPermissions(Number(id), selectedToAssign, permissionObjects);
    setSelectedToAssign([]);
  };

  const handleRemove = async () => {
    if (!id || selectedToRemove.length === 0) return;
    await removePermissions(Number(id), selectedToRemove);
    setSelectedToRemove([]);
  };

  return (
    <div className="p-6">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← {selectedRole.name}
      </h1>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails du rôle</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>
            <span className="text-gray-500 text-xs">Nom</span>
            <div className="font-medium">{selectedRole.name}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Description</span>
            <div className="font-medium">{selectedRole.description || "-"}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Permissions actuelles</CardTitle>
          <Button
            variant="outline"
            onClick={handleRemove}
            disabled={selectedToRemove.length === 0 || loadingPermissionUpdate}
          >
            Retirer la sélection
          </Button>
        </CardHeader>
        <CardContent>
          {rolePermissions.length === 0 ? (
            <div className="text-sm text-gray-500">Aucune permission.</div>
          ) : (
            <div className="space-y-2">
              {rolePermissions.map((perm) => (
                <div
                  key={perm.permissionId}
                  className="flex items-center gap-2 border-b pb-2"
                >
                  <Checkbox
                    checked={selectedToRemove.includes(perm.permissionId)}
                    onCheckedChange={(value) => {
                      setSelectedToRemove((prev) =>
                        Boolean(value)
                          ? [...prev, perm.permissionId]
                          : prev.filter((id) => id !== perm.permissionId)
                      );
                    }}
                  />
                  <div>
                    <div className="font-medium">{perm.name}</div>
                    <div className="text-xs text-gray-500">
                      {perm.description || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ajouter des permissions</CardTitle>
          <Button
            onClick={handleAssign}
            disabled={selectedToAssign.length === 0 || loadingPermissionUpdate}
            className="bg-primary text-white"
          >
            Attribuer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border border-gray-200 p-3 bg-white">
            <div className="relative w-full md:w-1/2">
              <Input
                placeholder="Rechercher une permission..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-3"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Chargement...</div>
          ) : permissions.length === 0 ? (
            <div className="text-sm text-gray-500">Aucune permission.</div>
          ) : (
            <div className="space-y-2">
              {permissions.map((perm) => {
                const disabled = assignedIds.has(perm.permissionId);
                const isSelected = selectedToAssign.includes(perm.permissionId);
                return (
                  <div
                    key={perm.permissionId}
                    className="flex items-center gap-2 border-b pb-2"
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      onCheckedChange={(value) => {
                        if (disabled) return;
                        setSelectedToAssign((prev) =>
                          Boolean(value)
                            ? [...prev, perm.permissionId]
                            : prev.filter((id) => id !== perm.permissionId)
                        );
                      }}
                    />
                    <div>
                      <div className="font-medium">{perm.name}</div>
                      <div className="text-xs text-gray-500">
                        {perm.description || "-"}
                      </div>
                    </div>
                    {disabled && (
                      <span className="text-xs text-gray-400">
                        Déjà attribuée
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <Pagination
              pages={totalPages}
              currentPage={page}
              onPageChange={setPage}
              rangeLimit={5}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleDetail;

