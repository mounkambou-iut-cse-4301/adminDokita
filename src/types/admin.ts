export interface Role {
  roleId: number;
  name: string;
  description?: string | null;
}

export interface Permission {
  permissionId: number;
  name: string;
  description?: string | null;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  sex?: string | null;
  email: string;
  phone?: string | null;
  isSuperAdmin?: boolean;
  isBlock?: boolean;
  isVerified?: boolean;
  roles?: Role[];
  permissions?: Permission[];
  createdAt?: string;
}
