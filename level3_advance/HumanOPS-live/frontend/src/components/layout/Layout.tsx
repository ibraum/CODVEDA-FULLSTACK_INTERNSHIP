import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import {
  updateMe,
  getProfile,
  updateProfile,
} from "../../features/auth/services/authService";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAlerts } from "../../hooks/useAlerts";
import { formatTimeAgo } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import AddSkillDialog from "../../features/dashboard/components/AddSkillDialog";
import TeamTab from "../../features/team/components/TeamTab";
import RequestsTab from "../../features/team/components/RequestsTab";
import HistoryTab from "../../features/team/components/HistoryTab";

const Layout = () => {
  const { logout, user } = useAuth();

  const today = new Date();
  const dayNumber = today.getDate().toString().padStart(2, "0");
  const dayName = today.toLocaleDateString("en-US", { weekday: "short" });
  const monthName = today.toLocaleDateString("en-US", { month: "long" });

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.lastName} ${user.firstName}`
      : user?.email || "Guest";
  const userRole = user?.role ? user.role.replace("_", " ") : "";
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const { alerts, markAllAsRead, unreadCount, markAsRead } = useAlerts();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [drawerTab, setDrawerTab] = useState<"team" | "requests" | "history">(
    "team"
  );

  // Settings Form State
  const [settingsFirstName, setSettingsFirstName] = useState("");
  const [settingsLastName, setSettingsLastName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState("");
  const [settingsNotifications, setSettingsNotifications] = useState(true); // Default reflected from backend analysis (preferences.notifications)
  const [settingsWorkingHours, setSettingsWorkingHours] =
    useState("09:00 - 17:00"); // Default from backend analysis

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setSettingsFirstName(user.firstName || "");
      setSettingsLastName(user.lastName || "");
      setSettingsEmail(user.email || "");
      setSettingsPassword(""); // Reset password field
      setSettingsConfirmPassword("");

      getProfile()
        .then((profile) => {
          if (profile && profile.preferences) {
            setSettingsNotifications(profile.preferences.notifications ?? true);
            setSettingsWorkingHours(
              profile.preferences.workingHours || "09:00 - 17:00"
            );
          }
        })
        .catch((err) => console.error("Failed to fetch profile settings", err));
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updateData: any = {
        firstName: settingsFirstName,
        lastName: settingsLastName,
        email: settingsEmail,
      };

      await updateMe(updateData);

      await updateProfile({
        preferences: {
          notifications: settingsNotifications,
          workingHours: settingsWorkingHours,
        },
      });

      // Simple reload to refresh user context for MVP
      window.location.reload();
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!settingsPassword) return;

    if (settingsPassword !== settingsConfirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    if (settingsPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateMe({
        password: settingsPassword,
      });

      setSettingsPassword("");
      setSettingsConfirmPassword("");
      alert("Mot de passe modifié avec succès !");
    } catch (error) {
      console.error("Failed to change password", error);
      alert("Erreur lors du changement de mot de passe.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const filteredAlerts =
    activeTab === "all" ? alerts : alerts.filter((a) => !a.isRead);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleAddSkill = () => {
    setIsAddSkillDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setIsLogoutDialogOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:grid lg:grid-rows-[280px_1fr] bg-white transition-all duration-300 ease-in-out ${
        isAlertPanelOpen ? "lg:grid-cols-[1fr_450px]" : "lg:grid-cols-[1fr]"
      }`}
    >
      <div className="w-full h-full flex flex-col lg:grid lg:grid-rows-[280px_1fr]">
        <header className="bg-neutral-100 py-6 px-4 lg:px-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-0 col-start-1 h-auto lg:h-full">
          <div className="w-full max-w-[750px] h-full flex flex-col justify-between items-start">
            <div className="flex items-center gap-4">
              {user?.role !== "COLLABORATOR" && (
                <Drawer direction="left">
                  <DrawerTrigger asChild>
                    <div className="menu h-14 w-14 rounded-full bg-white flex items-center justify-center shadow cursor-pointer hover:bg-neutral-50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                        />
                      </svg>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="h-full w-[350px] mt-0 rounded-r-[32px] rounded-l-none inset-y-0 left-0 right-auto bg-white border-r border-neutral-100 shadow-2xl p-0 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                      <DrawerHeader className="p-0 text-left">
                        <DrawerTitle className="text-3xl font-bold dm-sans-bold text-neutral-900">
                          Menu
                        </DrawerTitle>
                        <DrawerDescription className="text-neutral-500 mt-1">
                          Navigation principale
                        </DrawerDescription>
                      </DrawerHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto py-8 px-6">
                      <nav className="flex flex-col gap-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                              />
                            </svg>
                          </div>
                          Dashboard
                        </Link>
                        <Link
                          to="/"
                          className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all group"
                        >
                          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                              />
                            </svg>
                          </div>
                          Accueil
                        </Link>
                      </nav>
                    </div>

                    <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-lg font-medium text-red-600 hover:bg-red-50 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                            />
                          </svg>
                        </div>
                        Se déconnecter
                      </button>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
              <div className="h-14 w-14 rounded-full bg-black"></div>
              <div className="h-14 pt-1">
                <div className="text-lg">HumanOps-Live</div>
                <div className="text-sm text-neutral-500">Dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-6 self-end lg:self-auto">
              <div className="dm-sans-medium h-16 w-16 lg:h-22 lg:w-22 rounded-full flex items-center justify-center text-xl lg:text-3xl font-semibold text-neutral-900 border border-neutral-300 shrink-0">
                {dayNumber}
              </div>
              <div className="text-sm lg:text-md text-neutral-900">
                <div className="">{dayName},</div>
                <div className="">{monthName}</div>
              </div>
              <div className="h-10 w-[1px] bg-neutral-300 hidden lg:block"></div>
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="cursor-pointer text-white text-sm h-12 px-8 bg-black hover:bg-neutral-700 duration-300 rounded-full flex items-center gap-2">
                    {user?.role === "COLLABORATOR"
                      ? "My Team"
                      : "Show All Teams"}
                    {user?.role === "COLLABORATOR" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    )}
                  </button>
                </DrawerTrigger>
                <DrawerContent className="h-[calc(100vh-100px)] mt-0 rounded-t-3xl bg-white flex flex-col">
                  <DrawerHeader className="shrink-0 border-b border-neutral-100 pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <DrawerTitle className="text-2xl font-semibold dm-sans-bold">
                        Espace Collaborateur
                      </DrawerTitle>
                    </div>
                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => setDrawerTab("team")}
                        className={`pb-4 text-sm font-medium transition-all relative ${
                          drawerTab === "team"
                            ? "text-neutral-900"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        Mon équipe
                        {drawerTab === "team" && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setDrawerTab("requests")}
                        className={`pb-4 text-sm font-medium transition-all relative ${
                          drawerTab === "requests"
                            ? "text-neutral-900"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        Les demandes
                        {drawerTab === "requests" && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setDrawerTab("history")}
                        className={`pb-4 text-sm font-medium transition-all relative ${
                          drawerTab === "history"
                            ? "text-neutral-900"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        Mon Historique d'état
                        {drawerTab === "history" && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                        )}
                      </button>
                    </div>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
                    {drawerTab === "team" && <TeamTab />}
                    {drawerTab === "requests" && <RequestsTab />}
                    {drawerTab === "history" && <HistoryTab />}
                  </div>
                </DrawerContent>
              </Drawer>
              <button
                onClick={() => setIsAlertPanelOpen(!isAlertPanelOpen)}
                className="alert-button cursor-pointer text-white h-12 w-12 border border-neutral-300 rounded-full flex items-center justify-center relative text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                  />
                </svg>
                {unreadCount > 0 && (
                  <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-0"></div>
                )}
              </button>
            </div>
          </div>
          <div className="w-full max-w-[750px] h-full flex flex-col justify-between items-start mt-6 lg:mt-0">
            <div className="w-full flex items-center justify-between gap-6 hidden lg:flex">
              <div className="flex items-center gap-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="parametre-profil h-14 w-14 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] h-[90vh] max-w-none rounded-3xl p-0 overflow-hidden flex flex-col">
                    <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-bold dm-sans-bold">
                          Paramètres
                        </DialogTitle>
                        <DialogDescription>
                          Gérez vos préférences et paramètres de compte.
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="p-8 flex-1 overflow-y-auto bg-white">
                      <div className="max-w-4xl mx-auto space-y-8">
                        {/* Profile Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b border-neutral-100 pb-2 text-neutral-900">
                            Informations Personnelles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Prénom
                              </label>
                              <input
                                type="text"
                                value={settingsFirstName}
                                onChange={(e) =>
                                  setSettingsFirstName(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={settingsLastName}
                                onChange={(e) =>
                                  setSettingsLastName(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Email
                              </label>
                              <input
                                type="email"
                                value={settingsEmail}
                                onChange={(e) =>
                                  setSettingsEmail(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Rôle (Non modifiable)
                              </label>
                              <input
                                type="text"
                                value={userRole}
                                disabled
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 pb-4 border-b border-neutral-100">
                          <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow-md"
                          >
                            {isSaving
                              ? "Sauvegarde..."
                              : "Sauvegarder les modifications"}
                          </button>
                        </div>

                        {/* Password Change Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b border-neutral-100 pb-2 text-neutral-900">
                            Changer le mot de passe
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Entrer le mot de passe
                              </label>
                              <input
                                type="password"
                                value={settingsPassword}
                                onChange={(e) =>
                                  setSettingsPassword(e.target.value)
                                }
                                maxLength={20}
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-neutral-700">
                                Confirmer le mot de passe
                              </label>
                              <input
                                type="password"
                                value={settingsConfirmPassword}
                                onChange={(e) =>
                                  setSettingsConfirmPassword(e.target.value)
                                }
                                maxLength={20}
                                placeholder="••••••••"
                                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleChangePassword}
                              disabled={isSavingPassword || !settingsPassword}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 bg-black text-white hover:bg-red-700 shadow-sm"
                            >
                              {isSavingPassword
                                ? "Modification..."
                                : "Changer le mot de passe"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <AddSkillDialog
                  open={isAddSkillDialogOpen}
                  onOpenChange={setIsAddSkillDialogOpen}
                />
                <div className="h-14 w-14 rounded-full bg-black bg-[url('/src/assets/profil-bg.png')] bg-cover bg-center border border-neutral-300 shadow"></div>
                <div className="h-14 pt-1 dm-sans-regular">
                  <div className="text-lg">{fullName}</div>
                  <div className="text-sm">{userRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 flex items-center justify-center rounded-full border border-neutral-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <div className="dm-sans-regular text-neutral-500">
                  Start searching here...
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full gap-6">
              <div className="dm-sans-light text-neutral-400">
                <div className="text-3xl lg:text-5xl">Hey, Welcome back </div>
                <div className="text-3xl lg:text-5xl text-neutral-900">
                  {fullName} !
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-black duration-300 group relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 group-hover:text-white duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>

                  <div
                    className={`h-20 p-1 group-hover:bg-white group-hover:shadow-lg overflow-hidden rounded-full grid gap-1 cursor-pointer duration-300 group absolute top-0 z-[1000] ${
                      user?.role === "ADMIN_RH"
                        ? "group-hover:h-[256px] group-hover:grid-rows-3 group-hover:top-[-168px]"
                        : "group-hover:h-[172px] group-hover:grid-rows-2 group-hover:top-[-84px]"
                    }`}
                  >
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={handleAddSkill}
                            className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-300 duration-300 group-hover:flex hidden"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                              />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Ajouter une compétence</p>
                        </TooltipContent>
                      </Tooltip>

                      {user?.role === "ADMIN_RH" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-300 duration-300 group-hover:flex hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Paramètres RH</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={handleLogout}
                            className="h-20 w-20 rounded-full border border-neutral-300 flex items-center justify-center cursor-pointer hover:bg-neutral-800 bg-red-500 duration-300 group-hover:flex hidden"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                              />
                            </svg>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Se déconnecter</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="w-full mx-auto pt-8 pb-4 px-4 lg:px-12 col-start-1 min-h-[calc(100vh-280px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] lg:static lg:h-full lg:row-span-2 lg:col-start-2 bg-neutral-100 border-l border-neutral-200 transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none ${
          isAlertPanelOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 lg:hidden"
        }`}
      >
        <div className="h-full w-full bg-white rounded-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 relative pt-14 pb-2 px-8 shrink-0">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-semibold dm-sans-semibold">
                Alertes
              </h2>

              <button
                onClick={markAllAsRead}
                className="underline text-sm dm-sans-medium cursor-pointer hover:text-neutral-600 transition-colors"
              >
                Mark all as read
              </button>
            </div>
            <button
              onClick={() => setIsAlertPanelOpen(false)}
              className="h-10 w-10 flex items-center justify-center border border-neutral-300 hover:bg-neutral-100 cursor-pointer rounded-full transition-colors absolute right-1 top-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="w-full border-b border-b-2 border-neutral-200 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-start gap-4">
                <div
                  onClick={() => setActiveTab("all")}
                  className={`pb-2 px-2 cursor-pointer transition-colors dm-sans-medium flex items-center justify-center gap-2 border-b-3 ${
                    activeTab === "all"
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <div className="">All</div>{" "}
                  <div
                    className={`px-2 text-xs rounded-sm ${
                      activeTab === "all"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {alerts.length}
                  </div>
                </div>
                <div
                  onClick={() => setActiveTab("unread")}
                  className={`pb-2 px-2 cursor-pointer transition-colors dm-sans-medium flex items-center justify-center gap-2 border-b-3 ${
                    activeTab === "unread"
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <div className="">Unread</div>{" "}
                  <div
                    className={`px-2 text-xs rounded-sm ${
                      activeTab === "unread"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {unreadCount}
                  </div>
                </div>
              </div>
              <div className="more-horiz-icon pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-neutral-500 cursor-pointer hover:text-neutral-800 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  Aucune alerte pour le moment.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`px-8 py-4 grid grid-cols-[40px_1fr] gap-2 border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 ${
                      alert.isRead ? "bg-white" : "bg-orange-50"
                    }`}
                    onClick={() => !alert.isRead && markAsRead(alert.id)}
                  >
                    <div className="profile-icon rounded-lg h-[40px] w-[40px] bg-neutral-200 bg-[url(/src/assets/profil-bg.png)] bg-cover bg-center relative">
                      {!alert.isRead && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-neutral-900 font-regular text-sm">
                        {/* Render message securely or use a helper to format payload */}
                        {alert.payload.message || JSON.stringify(alert.payload)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatTimeAgo(alert.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action vous déconnectera de votre compte. Vous devrez vous
              reconnecter pour accéder à votre tableau de bord.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
