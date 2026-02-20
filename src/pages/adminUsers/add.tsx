import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/components/ui/form";
import { Input } from "src/components/components/ui/input";
import { Button } from "src/components/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/components/ui/select";
import { Checkbox } from "src/components/components/ui/checkbox";
import useAdminUserStore from "src/store/adminUserStore";
import useRoleStore from "src/store/roleStore";

const adminSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  sex: z.enum(["MALE", "FEMALE"]),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone requis"),
  password: z.string().min(6, "Mot de passe requis (min 6 caractères)"),
  isSuperAdmin: z.boolean().default(false),
  roleIds: z.array(z.number()).optional(),
});

type AdminFormValues = z.infer<typeof adminSchema>;

const AddAdminUser = () => {
  const navigate = useNavigate();
  const { createAdmin, loadingCreate, error } = useAdminUserStore();
  const { roles, fetchRoles, loadingRoles } = useRoleStore();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      sex: "MALE",
      email: "",
      phone: "",
      password: "",
      isSuperAdmin: false,
      roleIds: [],
    },
  });

  useEffect(() => {
    fetchRoles({ page: 1, limit: 200 });
  }, [fetchRoles]);

  useEffect(() => {
    form.setValue("roleIds", selectedRoles);
  }, [selectedRoles, form]);

  const availableRoles = useMemo(
    () => roles.filter((role) => !selectedRoles.includes(role.roleId)),
    [roles, selectedRoles]
  );

  const onSubmit = async (data: AdminFormValues) => {
    const payload = {
      ...data,
      roleIds: selectedRoles,
    };

    const created = await createAdmin(payload);
    if (created) {
      navigate("/admin/users");
    }
  };

  return (
    <div className="h-screen p-4">
      <h1
        className="text-xl font-semibold mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        ← Nouvel administrateur
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm w-full space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Création d'un administrateur</h2>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Homme</SelectItem>
                        <SelectItem value="FEMALE">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+237..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isSuperAdmin"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(Boolean(value))}
                    />
                  </FormControl>
                  <FormLabel>Super administrateur</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Rôles</label>
              <Select
                onValueChange={(value) =>
                  setSelectedRoles((prev) => [...prev, Number(value)])
                }
                disabled={loadingRoles || availableRoles.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingRoles
                        ? "Chargement..."
                        : "Sélectionner un rôle"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.roleId} value={String(role.roleId)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedRoles.map((roleId) => {
                    const role = roles.find((r) => r.roleId === roleId);
                    if (!role) return null;
                    return (
                      <div
                        key={roleId}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                      >
                        <span className="text-sm">{role.name}</span>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setSelectedRoles((prev) =>
                              prev.filter((id) => id !== roleId)
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loadingCreate}
                className="bg-primary text-white"
              >
                {loadingCreate ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddAdminUser;

