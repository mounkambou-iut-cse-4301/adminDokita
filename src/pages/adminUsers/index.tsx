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
import { Button } from "src/components/components/ui/button";
import { Input } from "src/components/components/ui/input";
import { Badge } from "src/components/components/ui/badge";
import Pagination from "src/components/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/components/ui/select";
import { FaSearch } from "react-icons/fa";
import TotalLoad from "src/components/components/totalLoad";
import useAdminUserStore from "src/store/adminUserStore";
import { joinUrlWithParamsId } from "src/helpers/helpers";

const PAGE_SIZE = 7;

const AdminUsers = () => {
  const navigate = useNavigate();
  const {
    admins,
    loadingList,
    pagination,
    fetchAdmins,
    error,
  } = useAdminUserStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isBlock, setIsBlock] = useState<string>("all");
  const [isVerified, setIsVerified] = useState<string>("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchAdmins({
      q: debouncedSearch || undefined,
      page,
      limit: PAGE_SIZE,
      isBlock: isBlock === "all" ? undefined : isBlock === "true",
      isVerified: isVerified === "all" ? undefined : isVerified === "true",
    });
  }, [page, debouncedSearch, isBlock, isVerified, fetchAdmins]);

  const totalPages = useMemo(() => {
    const total = pagination?.total || admins.length || 1;
    const limit = pagination?.limit || PAGE_SIZE;
    return Math.max(1, Math.ceil(total / limit));
  }, [pagination, admins.length]);

  if (loadingList) {
    return <TotalLoad />;
  }

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Administrateurs</h1>
        <Button
          className="bg-primary text-white"
          onClick={() => navigate("/admin/users/create")}
        >
          + Ajouter un administrateur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 border border-gray-200 p-3 bg-white">
        <div className="relative w-full md:w-1/2">
          <Input
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={isBlock} onValueChange={setIsBlock}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut blocage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="false">Actifs</SelectItem>
              <SelectItem value="true">Bloqués</SelectItem>
            </SelectContent>
          </Select>
          <Select value={isVerified} onValueChange={setIsVerified}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Vérification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="true">Vérifiés</SelectItem>
              <SelectItem value="false">Non vérifiés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      )}

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead>Nom complet</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôles</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin) => (
            <TableRow
              key={admin.userId}
              className="cursor-pointer"
              onClick={() =>
                navigate(joinUrlWithParamsId("/admin/users/:id", admin.userId))
              }
            >
              <TableCell className="font-medium">
                {admin.firstName} {admin.lastName}
              </TableCell>
              <TableCell className="text-blue-600 underline">
                {admin.email}
              </TableCell>
              <TableCell>{admin.phone || "-"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {(admin.roles || []).length === 0 && (
                    <span className="text-xs text-gray-400">Aucun rôle</span>
                  )}
                  {(admin.roles || []).map((role) => (
                    <Badge key={role.roleId}>{role.name}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {admin.isBlock ? (
                    <Badge className="bg-red-100 text-red-700">Bloqué</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700">Actif</Badge>
                  )}
                  {admin.isVerified ? (
                    <Badge className="bg-blue-100 text-blue-700">Vérifié</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600">Non vérifié</Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-white">
          <TableRow>
            <TableCell colSpan={5}>
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
    </div>
  );
};

export default AdminUsers;

