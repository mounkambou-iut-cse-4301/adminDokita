import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "src/components/components/ui/button";
import { Badge } from "src/components/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/components/ui/card";
import TMModal from "src/components/components/ui/TM_Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/components/ui/select";
import TotalLoad from "src/components/components/totalLoad";
import useAdminUserStore from "src/store/adminUserStore";
import useRoleStore from "src/store/roleStore";

const AdminUserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const {
    selectedAdmin,
    loadingDetail,
    loadingRoleUpdate,
    fetchAdminById,
    assignRoleToUser,
    removeRoleFromUser,
    error,
  } = useAdminUserStore();
  const { roles, fetchRoles } = useRoleStore();

  useEffect(() => {
    if (id) {
      fetchAdminById(id);
    }
  }, [id, fetchAdminById]);

  useEffect(() => {
    fetchRoles({ page: 1, limit: 200 });
  }, [fetchRoles]);

  const assignedRoleIds = useMemo(
    () => new Set((selectedAdmin?.roles || []).map((role) => role.roleId)),
    [selectedAdmin]
  );

  const availableRoles = useMemo(
    () => roles.filter((role) => !assignedRoleIds.has(role.roleId)),
    [roles, assignedRoleIds]
  );

  if (loadingDetail) {
    return <TotalLoad />;
  }

  if (!selectedAdmin) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-600">Administrateur introuvable.</div>
      </div>
    );
  }

  const handleAssignRole = async () => {
    if (!id || !selectedRoleId) return;
    const roleId = Number(selectedRoleId);
    const role = roles.find((r) => r.roleId === roleId);
    await assignRoleToUser(Number(id), roleId, role);
    setSelectedRoleId("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← {selectedAdmin.firstName} {selectedAdmin.lastName}
      </h1>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs">Email</div>
            <div className="font-medium">{selectedAdmin.email}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Téléphone</div>
            <div className="font-medium">{selectedAdmin.phone || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Super Admin</div>
            <div className="font-medium">
              {selectedAdmin.isSuperAdmin ? "Oui" : "Non"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Statut</div>
            <div className="flex gap-2">
              {selectedAdmin.isBlock ? (
                <Badge className="bg-red-100 text-red-700">Bloqué</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">Actif</Badge>
              )}
              {selectedAdmin.isVerified ? (
                <Badge className="bg-blue-100 text-blue-700">Vérifié</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-600">Non vérifié</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rôles</CardTitle>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            + Ajouter un rôle
          </Button>
        </CardHeader>
        <CardContent>
          {(selectedAdmin.roles || []).length === 0 ? (
            <div className="text-sm text-gray-500">
              Aucun rôle assigné pour le moment.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(selectedAdmin.roles || []).map((role) => (
                <div
                  key={role.roleId}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                >
                  <span className="text-sm">{role.name}</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      removeRoleFromUser(selectedAdmin.userId, role.roleId)
                    }
                    disabled={loadingRoleUpdate}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un rôle"
        size="md"
      >
        <div className="space-y-4">
          <Select
            value={selectedRoleId}
            onValueChange={setSelectedRoleId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.roleId} value={String(role.roleId)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRoleId || loadingRoleUpdate}
              className="bg-primary text-white"
            >
              {loadingRoleUpdate ? "Attribution..." : "Attribuer"}
            </Button>
          </div>
        </div>
      </TMModal>
    </div>
  );
};

export default AdminUserDetail;

