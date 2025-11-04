import React, { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaSignOutAlt, FaLanguage } from "react-icons/fa";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import TMModal from "./components/ui/TM_Modal";
import NotificationComponent from "./components/ui/TM_Notification/Notification";
import { Notifications } from "./components/ui/TM_Notification/types";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useI18nStore } from "../store/i18n/i18nStore";
import { useTranslation } from "../hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

import Profil from "./profil";
import { useThemeStore } from "src/store/themeStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import dayjs from "dayjs";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { language, setLanguage } = useI18nStore();
  const { t } = useTranslation();

  const { theme, toggleTheme } = useThemeStore();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewDetails = (notification: any) => {
    const detailNotification: Notifications = {
      id: notification.id,
      icon: "fas fa-info-circle",
      title: t("header.notification_details"),
      message: notification.activity,
      time: new Date(notification.created_at).toLocaleDateString(),
      username: notification.member.email,
      isRead: false,
    };
    handleCloseModal();
    navigate("/notificationdetail", {
      state: { notification: detailNotification },
    });
  };

  const handleLogout = () => {
    // Supprime le token du localStorage
    localStorage.removeItem("token");

    // Tu peux aussi vider d’autres infos (user, roles, etc.)
    localStorage.removeItem("user");

    // Redirige vers login
    navigate("/");
  };

  useEffect(() => {}, []);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const count = 2;

  const savedStateString = localStorage.getItem("user");

  const savedState = savedStateString ? JSON.parse(savedStateString) : null;

  console.log("users", savedState); // ✅ YOUSSOUF

  return (
    <div className="flex bg-gray-100 justify-between items-center p-6">
      <div>
        <h2 className="text-xl font-bold">
          Hello {savedState?.firstName} {savedState?.lastName} !!!
        </h2>
        <p className="text-gray-500 text-sm">
          {" "}
          {dayjs(savedState?.createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher"
          className="pl-10 pr-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
        />
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <FaBell className="text-xl text-gray-600" />

            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.1 rounded-full">
                {count}
              </span>
            )}
          </div>

          <span className="font-medium">
            {savedState?.firstName} {savedState?.lastName} 
          </span>

          <Popover>
            <PopoverTrigger className="bg-inherit text-left px-4 py-1 text-sm  border-0 rounded-md hover:bg-gray-100">
              <img
                src="/docta.png"
                alt="Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </PopoverTrigger>

            <PopoverContent className="w-full">
              <button
                className="text-sm text-white bg-[#1d3557] rounded-md hover:bg-[#16314e]"
                onClick={handleLogout}
              >
                Deconnectez
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Header;
