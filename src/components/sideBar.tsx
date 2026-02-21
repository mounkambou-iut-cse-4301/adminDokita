import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaThLarge,
  FaUser,
  FaUserMd,
  FaCreditCard,
  FaCalendarCheck,
  FaSyncAlt,
  FaFileAlt,
  FaChalkboardTeacher,
  FaTags,
  FaPrescriptionBottleAlt,
  FaPills,
  FaVirus,
  FaVideo,
  FaDotCircle,
} from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import { useThemeStore } from "src/store/themeStore";
import { GraduationCap } from "lucide-react";
import usePermissionStore from "src/store/permissionStore";
import type { Permission } from "src/types/admin";

const SideBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { theme } = useThemeStore();
  const { permissions, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchPermissions({ page: 1, limit: 500 });
    }
  }, [fetchPermissions]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const userPermissions = new Set<string>(
    Array.isArray(storedUser?.permissions)
      ? storedUser.permissions.map((perm: Permission) => perm.name)
      : [],
  );

  const allPermissions = new Set<string>(
    Array.isArray(permissions) ? permissions.map((perm) => perm.name) : [],
  );

  const hasPermission = (required?: string | string[]) => {
    if (!required) return true;
    if (userPermissions.has("ALL_PERMISSIONS")) return true;
    if (userPermissions.has("ADMIN_PANEL")) return true;
    const requiredList = Array.isArray(required) ? required : [required];
    const effectiveRequired =
      allPermissions.size > 0
        ? requiredList.filter((perm) => allPermissions.has(perm))
        : requiredList;
    return effectiveRequired.some((perm) => userPermissions.has(perm));
  };

  const items = [
    {
      name: "Dashboard",
      pathname: "/home",
      icon: <FaThLarge />,
      subItems: [],
      permissions: "ADMIN_PANEL",
    },

    {
      name: "Administration",
      pathname: "/admin/users",
      icon: <FaUser />,
      subItems: [
        {
          name: "Administrateurs",
          pathname: "/admin/users",
          icon: <FaUser />,
          subItems: [],
          permissions: ["LIST_USERS", "GET_USERS", "ASSIGN_USER_ROLES"],
        },

        {
          name: "Rôles",
          pathname: "/admin/roles",
          icon: <FaTags />,
          subItems: [],
          permissions: ["LIST_ROLES", "GET_ROLES", "ASSIGN_ROLE_PERMISSIONS"],
        },
      ],
      permissions: ["LIST_ORDONANCES", "LIST_MEDICAMENTS"],
    },

    {
      name: "Patients",
      pathname: "/patients",
      icon: (
        <div className="relative">
          <FaUser />
          <FaDotCircle className="absolute -top-1 -right-1 text-yellow-400 text-[8px]" />
        </div>
      ),
      subItems: [],
      permissions: "LIST_USERS",
    },
    {
      name: "Docteurs",
      pathname: "/doctors",
      icon: <FaUserMd />,
      subItems: [],
      permissions: "LIST_USERS",
    },

    {
      name: "Specialite",
      pathname: "/specialite",
      icon: <GraduationCap />,
      subItems: [],
      permissions: "LIST_SPECIALITIES",
    },

    {
      name: "Abonnements",
      pathname: "/abonnement",
      icon: <FaCreditCard />,
      subItems: [],
      permissions: "LIST_ABONNEMENTS",
    },
    {
      name: "Rendez-vous",
      pathname: "/rendez_vous",
      icon: <FaCalendarCheck />,
      subItems: [],
      permissions: "LIST_RESERVATIONS",
    },
    {
      name: "Transactions",
      pathname: "/transaction",
      icon: <FaCreditCard />,
      subItems: [],
      permissions: "LIST_TRANSACTIONS",
    },

    /*    {
      name: "Ordonnance",
      pathname: "/ordonnance",
      icon: <FaPrescriptionBottleAlt />,
      subItems: [
        { name: t("Médicament"), pathname: "/ordonnance", icon: <FaPills /> },
        { name: t("Maladie"), pathname: "/listRole", icon: <FaVirus /> },
      ],
    }, */

    {
      name: "Ordonnance",
      pathname: "/ordonnance",
      icon: <FaPrescriptionBottleAlt />,
      subItems: [
        {
          name: t("Protocole"),
          pathname: "/ordonnance",
          icon: <FaVirus />,
          permissions: "LIST_ORDONANCES",
        },

        {
          name: t("Medicament"),
          pathname: "/medicamant",
          icon: <FaPills />,
          permissions: "LIST_MEDICAMENTS",
        },
      ],
      permissions: ["LIST_ORDONANCES", "LIST_MEDICAMENTS"],
    },

    {
      name: "Fiche structurées",
      pathname: "/message_structure",
      icon: <FaFileAlt />,
      subItems: [],
      permissions: "LIST_FICHES",
    },
    {
      name: "Formation Continue",
      pathname: "/formation",
      icon: <FaChalkboardTeacher />,
      subItems: [
        {
          name: t("Formation"),
          pathname: "/formation",
          icon: <FaChalkboardTeacher />,
          permissions: "LIST_FORMATIONS_CONTINUE",
        },
        {
          name: t("Catégorie"),
          pathname: "/categorie",
          icon: <FaTags />,
          permissions: "LIST_CATEGORIES",
        },
      ],
      permissions: ["LIST_FORMATIONS_CONTINUE", "LIST_CATEGORIES"],
    },

    {
      name: "Vidéos Educatives",
      pathname: "/videos",
      icon: <FaVideo />,
      subItems: [
        {
          name: t("Vidéos Educatives"),
          pathname: "/videos",
          icon: <FaVideo />,
          permissions: "LIST_VIDEOS",
        },
        {
          name: t("Catégorie"),
          pathname: "/categorie_video",
          icon: <FaTags />,
          permissions: "LIST_CATEGORIES_VIDEO",
        },
      ],
      permissions: ["LIST_VIDEOS", "LIST_CATEGORIES_VIDEO"],
    },
    /*   {
      name: "Synchronisation",
      pathname: "/synchronisation",
      icon: <FaSyncAlt />,
      subItems: [],
    }, */
  ];

  const visibleItems = items
    .map((item) => {
      if (!item.subItems || item.subItems.length === 0) return item;
      const filteredSub = item.subItems.filter((subItem: any) =>
        hasPermission(subItem.permissions),
      );
      return { ...item, subItems: filteredSub };
    })
    .filter((item: any) => {
      const hasSub = item.subItems && item.subItems.length > 0;
      return hasPermission(item.permissions) || hasSub;
    });

  return (
    <div className="h-full w-full flex flex-col bg-primary py-6 px-4 dark:bg-[#1d0553]">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <span className="text-xl text-white font-bold">Dokita</span>
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-6 w-full" />

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {visibleItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div
              onClick={() =>
                item.subItems.length > 0
                  ? toggleMenu(item.name)
                  : navigate(item.pathname)
              }
              className={`flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-all ${
                location.pathname === item.pathname
                  ? "text-yellow-400 bg-white/10"
                  : "hover:text-yellow-300 text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.subItems.length > 0 && (
                <span className="text-sm">
                  {openMenus[item.name] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              )}
            </div>

            {/* Sous-menus */}
            {item.subItems.length > 0 && openMenus[item.name] && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                {item.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => navigate(subItem.pathname)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer text-sm transition-all ${
                      location.pathname === subItem.pathname
                        ? "text-yellow-400 bg-white/10"
                        : "hover:text-yellow-300 text-white"
                    }`}
                  >
                    <span className="text-xs">{subItem.icon}</span>
                    <span>{subItem.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
