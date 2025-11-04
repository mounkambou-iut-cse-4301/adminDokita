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
import { useAuthStore } from "src/store/authStore";
import { useThemeStore } from "src/store/themeStore";

const SideBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const user = useAuthStore((state) => state.user);
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const items = [
    {
      name: "Dashboard",
      pathname: "/home",
      icon: <FaThLarge />,
      subItems: [],
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
    },
    {
      name: "Docteurs",
      pathname: "/doctors",
      icon: <FaUserMd />,
      subItems: [],
    },
    {
      name: "Abonnements",
      pathname: "/abonnement",
      icon: <FaCreditCard />,
      subItems: [],
    },
    {
      name: "Rendez-vous",
      pathname: "/rendez_vous",
      icon: <FaCalendarCheck />,
      subItems: [],
    },
    {
      name: "Transactions",
      pathname: "/transaction",
      icon: <FaCreditCard />,
      subItems: [],
    },

    {
      name: "Ordonnance",
      pathname: "/ordonnance",
      icon: <FaPrescriptionBottleAlt />,
      subItems: [
        { name: t("Médicament"), pathname: "/ordonnance", icon: <FaPills /> },
        { name: t("Maladie"), pathname: "/listRole", icon: <FaVirus /> },
      ],
    },

    {
      name: "Fiche structurées",
      pathname: "/message_structure",
      icon: <FaFileAlt />,
      subItems: [],
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
        },
        { name: t("Catégorie"), pathname: "/categorie", icon: <FaTags /> },
      ],
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
        },
        {
          name: t("Catégorie"),
          pathname: "/categorie_video",
          icon: <FaTags />,
        },
      ],
    },
    {
      name: "Synchronisation",
      pathname: "/synchronisation",
      icon: <FaSyncAlt />,
      subItems: [],
    },
  ];

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
        {items.map((item, index) => (
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
