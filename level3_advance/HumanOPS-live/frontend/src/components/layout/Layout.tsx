import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import {
  updateMe,
  getProfile,
  updateProfile,
  getAllSkills,
  addSkill,
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
import { useRealtimeNotifications } from "../../hooks/useRealtimeNotifications";
import { formatTimeAgo } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import TeamTab from "../../features/team/components/TeamTab";
import RequestsTab from "../../features/team/components/RequestsTab";
import HistoryTab from "../../features/team/components/HistoryTab";
import TeamsTab from "../../features/rh/components/TeamsTab";
import ManageUsersTab from "../../features/rh/components/ManageUsersTab";
import ManageSkillsTab from "../../features/rh/components/ManageSkillsTab";
import AddSkillDialog from "../../features/dashboard/components/AddSkillDialog";
import { getRHSettings, updateRHSetting } from "../../features/rh/services/rhService";

const Layout = () => {
  const { logout, user } = useAuth();

  // Enable real-time notifications
  useRealtimeNotifications();

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
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const { alerts, markAllAsRead, unreadCount, markAsRead } = useAlerts();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<
    "team" | "requests" | "history" | "teams" | "users" | "skills"
  >(user?.role === "ADMIN_RH" ? "teams" : "team");

  // Settings Form State
  const [settingsFirstName, setSettingsFirstName] = useState("");
  const [settingsLastName, setSettingsLastName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState("");
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  const [settingsWorkingHours, setSettingsWorkingHours] =
    useState("09:00 - 17:00");

  // Skills State
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // RH Settings State
  const [rhTensionThreshold, setRhTensionThreshold] = useState(80);
  const [rhCriticalThreshold, setRhCriticalThreshold] = useState(90);
  const [rhAutoAssign, setRhAutoAssign] = useState(false);
  const [rhEmailAlerts, setRhEmailAlerts] = useState(true);

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

      // Fetch skills
      getAllSkills()
        .then((skillsData) => {
          setSkills(skillsData);
        })
        .catch((err) => console.error("Failed to fetch skills", err));

      if (user.role === "ADMIN_RH") {
        getRHSettings().then(settings => {
          if (settings) {
            settings.forEach(s => {
              if (s.key === 'rhTensionThreshold') setRhTensionThreshold(s.value);
              if (s.key === 'rhCriticalThreshold') setRhCriticalThreshold(s.value);
              if (s.key === 'rhAutoAssign') setRhAutoAssign(s.value);
              if (s.key === 'rhEmailAlerts') setRhEmailAlerts(s.value);
            });
          }
        }).catch(err => console.error("Failed to fetch RH settings", err));
      }
    }
  }, [user]);

  const handleSaveRHSettings = async () => {
    setIsSaving(true);
    try {
      // Update each setting
      await Promise.all([
        updateRHSetting('rhTensionThreshold', rhTensionThreshold),
        updateRHSetting('rhCriticalThreshold', rhCriticalThreshold),
        updateRHSetting('rhAutoAssign', rhAutoAssign),
        updateRHSetting('rhEmailAlerts', rhEmailAlerts)
      ]);
      // Optional: Add toast success here
    } catch (error) {
      console.error("Failed to save RH settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    setIsLoadingSkills(true);
    try {
      await addSkill(newSkill);
      const updatedSkills = await getAllSkills();
      setSkills(updatedSkills);
      setNewSkill("");
    } catch (error) {
      console.error("Failed to add skill", error);
    } finally {
      setIsLoadingSkills(false);
    }
  };

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
      // alert("Failed to save settings"); // Removed
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!settingsPassword) return;

    if (settingsPassword !== settingsConfirmPassword) {
      console.warn("Passwords do not match");
      return;
    }

    if (settingsPassword.length < 6) {
      console.warn("Password too short");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updateMe({
        password: settingsPassword,
      });

      setSettingsPassword("");
      setSettingsConfirmPassword("");
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password", error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const filteredAlerts = activeTab === "all" ? alerts : alerts.filter((a) => !a.isRead);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setIsLogoutDialogOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:grid lg:grid-rows-[280px_1fr] bg-background transition-all duration-300 ease-in-out ${isAlertPanelOpen ? "lg:grid-cols-[1fr_450px]" : "lg:grid-cols-[1fr]"
        }`}
    >
      <div className="w-full h-full flex flex-col lg:grid lg:grid-rows-[280px_1fr]">
        <header className="bg-muted/40 dark:bg-muted/10 py-2 px-4  lg:px-12 lg:py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center lg:gap-0 col-start-1 h-auto lg:h-full">
          <div className="w-full md:max-w-[875px] md:w-full lg:w-full lg:max-w-[750px] h-full flex flex-col justify-between items-start">
            <div className="flex items-center gap-4 lg:mb-0 mb-6">
              <div className="h-10 w-10 lg:h-14 lg:w-14 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <span className="text-sm lg:text-xl font-bold text-white dark:text-black">HOL</span>
              </div>
              <div className="lg:h-14 h-10 lg:pt-1">
                <div className="text-lg">HumanOps-Live</div>
                <div className="text-sm text-muted-foreground">Dashboard</div>
              </div>
            </div>
            <div className="mb-4 w-full h-[1px] bg-neutral-200 md:hidden block"></div>
            <div className="flex items-center justify-between w-full lg:justify-start lg:w-auto lg:gap-6 self-end lg:self-auto">
              <div className="dm-sans-medium h-12 w-12 lg:h-22 lg:w-22 rounded-full flex items-center justify-center text-xl lg:text-3xl font-semibold text-foreground border border-border shrink-0">
                {dayNumber}
              </div>
              <div className="text-sm lg:text-md text-foreground">
                <div className="">{dayName},</div>
                <div className="">{monthName}</div>
              </div>
              <div className="h-10 w-[1px] bg-neutral-300 hidden lg:block"></div>
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="cursor-pointer text-white text-sm h-12 px-8 bg-orange-600 hover:bg-orange-700 duration-300 rounded-full flex items-center gap-2">
                    {user?.role === "COLLABORATOR"
                      ? "My Team"
                      : user?.role === "ADMIN_RH"
                        ? "Manage Plateform"
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
                <DrawerContent className="h-[calc(100vh-100px)] mt-0 rounded-t-3xl bg-background flex flex-col">
                  <DrawerHeader className="shrink-0 border-b border-border pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <DrawerTitle className="text-2xl font-semibold dm-sans-bold">
                        {user?.role === "COLLABORATOR"
                          ? "Espace Collaborateur"
                          : user?.role === "ADMIN_RH"
                            ? "Espace Admin RH"
                            : "Espace Manager"}
                      </DrawerTitle>
                    </div>
                    <div className="flex items-center gap-8">
                      {user?.role === "ADMIN_RH" ? (
                        <>
                          <button
                            onClick={() => setDrawerTab("teams")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "teams"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Les équipes
                            {drawerTab === "teams" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                          <button
                            onClick={() => setDrawerTab("users")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "users"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Manage Users
                            {drawerTab === "users" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                          <button
                            onClick={() => setDrawerTab("skills")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "skills"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Manage Skills
                            {drawerTab === "skills" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                          <button
                            onClick={() => setDrawerTab("requests")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "requests"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Les demandes
                            {drawerTab === "requests" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                        </>
                      ) : user?.role === "COLLABORATOR" ? (
                        <>
                          <button
                            onClick={() => setDrawerTab("team")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "team"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Mon équipe
                            {drawerTab === "team" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                          <button
                            onClick={() => setDrawerTab("history")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "history"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Mon Historique d'état
                            {drawerTab === "history" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setDrawerTab("team")}
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "team"
                              ? "text-foreground"
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
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "requests"
                              ? "text-foreground"
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
                            className={`pb-4 text-sm font-medium transition-all relative ${drawerTab === "history"
                              ? "text-foreground"
                              : "text-neutral-400 hover:text-neutral-600"
                              }`}
                          >
                            Mon Historique d'état
                            {drawerTab === "history" && (
                              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-t-full"></div>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto scrollbar p-6 bg-muted/40 dark:bg-muted/10">
                    {user?.role === "ADMIN_RH" ? (
                      <>
                        {drawerTab === "teams" && <TeamsTab />}
                        {drawerTab === "users" && <ManageUsersTab />}
                        {drawerTab === "skills" && <ManageSkillsTab />}
                        {drawerTab === "requests" && <RequestsTab />}
                      </>
                    ) : user?.role === "COLLABORATOR" ? (
                      <>
                        {drawerTab === "team" && <TeamTab />}
                        {drawerTab === "history" && <HistoryTab />}
                      </>
                    ) : (
                      <>
                        {drawerTab === "team" && <TeamTab />}
                        {drawerTab === "requests" && <RequestsTab />}
                        {drawerTab === "history" && <HistoryTab />}
                      </>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
              <button
                onClick={() => setIsAlertPanelOpen(!isAlertPanelOpen)}
                className="alert-button cursor-pointer h-10 w-10 lg:h-12 lg:w-12  border border-border rounded-full flex items-center justify-center relative text-foreground hover:bg-muted transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 lg:size-6 text-foreground"
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
          <div className="mt-4 w-full h-[1px] bg-neutral-200 md:hidden block"></div>
          <div className="w-full md:max-w-[875px] md:w-full lg:w-full lg:max-w-[750px] h-full flex flex-col justify-between items-start mt-4 lg:mt-0">
            <div className="w-full flex items-center justify-between gap-2 lg:gap-6 lg:flex">
              <div className="flex items-center lg:gap-6 gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="parametre-profil lg:h-14 lg:w-14 h-10 w-10 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors text-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 lg:size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="w-[1100px] h-[90vh] max-w-[90%] rounded-2xl md:rounded-4xl p-0 overflow-hidden flex flex-col">
                    <div className="bg-muted/40 dark:bg-neutral-800 px-8 py-6 border-b border-border flex items-center justify-between">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-bold dm-sans-bold">
                          Paramètres
                        </DialogTitle>
                        <DialogDescription>
                          Gérez vos préférences et paramètres de compte.
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="p-8 flex-1 overflow-y-auto scrollbar bg-background">
                      <div className="max-w-4xl mx-auto space-y-8">
                        {/* Profile Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">
                            Informations Personnelles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Prénom
                              </label>
                              <input
                                type="text"
                                value={settingsFirstName}
                                onChange={(e) =>
                                  setSettingsFirstName(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={settingsLastName}
                                onChange={(e) =>
                                  setSettingsLastName(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-medium text-foreground">
                                Email
                              </label>
                              <input
                                type="email"
                                value={settingsEmail}
                                onChange={(e) =>
                                  setSettingsEmail(e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-medium text-foreground">
                                Rôle (Non modifiable)
                              </label>
                              <input
                                type="text"
                                value={userRole}
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 pb-4 border-b border-border">
                          <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                          >
                            {isSaving
                              ? "Sauvegarde..."
                              : "Sauvegarder les modifications"}
                          </button>
                        </div>

                        {/* Password Change Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">
                            Changer le mot de passe
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
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
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
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
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={handleChangePassword}
                              disabled={isSavingPassword || !settingsPassword}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white shadow-sm"
                            >
                              {isSavingPassword
                                ? "Modification..."
                                : "Changer le mot de passe"}
                            </button>
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">
                            Mes Compétences
                          </h3>
                          <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {skills.length === 0 ? (
                              <p className="text-muted-foreground text-sm">
                                Aucune compétence ajoutée
                              </p>
                            ) : (
                              skills.map((skill) => (
                                <span
                                  key={skill.id}
                                  className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                                >
                                  {skill.name}
                                </span>
                              ))
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Ajouter une compétence..."
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAddSkill()
                              }
                              className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <button
                              onClick={handleAddSkill}
                              disabled={isLoadingSkills || !newSkill.trim()}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {isLoadingSkills ? "..." : "Ajouter"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className={`lg:h-14 lg:w-14 h-10 w-10 rounded-full bg-black bg-cover bg-center border border-border shadow ${userRole == "COLLABORATOR" ? "bg-[url('/src/assets/profil-bg.png')]" : userRole == "MANAGER" ? "bg-[url('/src/assets/profiles/profile-2.png')]" : "bg-[url('/src/assets/profiles/profile-6.png')]"}`}></div>
                <div className="lg:h-14 h-10 lg:pt-1 dm-sans-regular lg:text-lg text-sm">
                  <div className="text-lg">{fullName}</div>
                  <div className="text-sm">{userRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleTheme}
                  className="lg:h-14 lg:w-14 h-10 w-10 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors cursor-pointer text-foreground"
                >
                  {theme === "light" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 lg:size-6 text-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 lg:size-6 text-foreground dark:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  )}
                </button>
                <div className="dm-sans-regular text-muted-foreground dark:text-neutral-400 lg:flex hidden">
                  {theme === "light" ? "Switch to Dark" : "Switch to Light"}
                </div>
              </div>
            </div>
            <div className="mt-4 w-full h-[1px] bg-neutral-200 md:hidden block"></div>
            <div className="flex items-center justify-between w-full gap-6 mt-4 lg:mt-0 ">
              <div className="dm-sans-light text-muted-foreground">
                <div className="text-2xl lg:text-5xl">Hey, Welcome back </div>
                <div className="text-3xl lg:text-5xl text-foreground">
                  {fullName} !
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="lg:h-20 lg:w-20 h-16 w-16 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-neutral-900 dark:hover:bg-primary duration-300 group relative text-foreground">
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
                    className={`h-20 p-1 group-hover:bg-card dark:group-hover:bg-card group-hover:shadow-lg overflow-hidden rounded-full grid gap-1 cursor-pointer duration-300 group absolute top-0 z-[1000] ${user?.role === "ADMIN_RH"
                      ? "group-hover:h-[256px] group-hover:grid-rows-3 group-hover:top-[-168px]"
                      : "group-hover:h-[172px] group-hover:grid-rows-2 group-hover:top-[-84px]"
                      }`}
                  >
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() => setIsAddSkillDialogOpen(true)}
                            className="h-20 w-20 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-muted dark:hover:bg-muted/50 duration-300 group-hover:flex hidden text-foreground"
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
                        <Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <div className="h-20 w-20 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-muted dark:hover:bg-muted/50 duration-300 group-hover:flex hidden text-foreground">
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
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Paramètres RH</p>
                            </TooltipContent>
                          </Tooltip>
                          <DialogContent className="w-[1000px] h-[90vh] max-w-[90%] rounded-2xl md:rounded-4xl p-0 overflow-hidden flex flex-col">
                            <div className="bg-muted/40 dark:bg-neutral-800 px-8 py-6 border-b border-border flex items-center justify-between">
                              <DialogHeader className="text-left">
                                <DialogTitle className="text-2xl font-bold dm-sans-bold">
                                  Paramètres RH
                                </DialogTitle>
                                <DialogDescription>
                                  Configuration globale de la plateforme et seuils d'alerte.
                                </DialogDescription>
                              </DialogHeader>
                            </div>
                            <div className="p-8 flex-1 overflow-y-auto scrollbar bg-background">
                              <div className="max-w-4xl mx-auto space-y-8">
                                {/* Alert Thresholds */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">
                                    Seuils d'Alerte (Tension)
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Seuil de tension (Warning) %
                                      </label>
                                      <input
                                        type="number"
                                        value={rhTensionThreshold}
                                        onChange={(e) => setRhTensionThreshold(Number(e.target.value))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      />
                                      <p className="text-xs text-muted-foreground">Déclenche une alerte jaune.</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Seuil Critique %
                                      </label>
                                      <input
                                        type="number"
                                        value={rhCriticalThreshold}
                                        onChange={(e) => setRhCriticalThreshold(Number(e.target.value))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      />
                                      <p className="text-xs text-muted-foreground">Déclenche une alerte rouge.</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Automation Settings */}
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold border-b border-border pb-2 text-foreground">
                                    Automatisation
                                  </h3>
                                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card bg-muted/20">
                                    <div className="space-y-0.5">
                                      <label className="text-sm font-medium text-foreground block">
                                        Assignation automatique
                                      </label>
                                      <p className="text-xs text-muted-foreground">
                                        Assigner automatiquement les demandes de renfort selon les compétences.
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() => setRhAutoAssign(!rhAutoAssign)}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${rhAutoAssign ? 'bg-primary' : 'bg-muted border border-input'}`}
                                      >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${rhAutoAssign ? 'left-6' : 'left-1'}`}></div>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                  <button
                                    onClick={handleSaveRHSettings}
                                    disabled={isSaving}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md disabled:opacity-50"
                                  >
                                    {isSaving ? "Sauvegarde..." : "Sauvegarder la configuration"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={handleLogout}
                            className="h-20 w-20 rounded-full border border-border flex items-center justify-center cursor-pointer hover:bg-red-600 bg-red-500 duration-300 group-hover:flex hidden text-white"
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
        <main className="w-full mx-auto pt-8 pb-4 px-4 lg:px-12 col-start-1 min-h-[calc(100vh-280px)] overflow-y-auto scrollbar">
          <Outlet />
        </main>
      </div>
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] lg:static lg:h-full lg:row-span-2 lg:col-start-2 bg-background border-l border-border transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none ${isAlertPanelOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 lg:hidden"
          }`}
      >
        <div className="h-full w-full bg-card rounded-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 relative pt-14 pb-2 px-8 shrink-0">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-semibold dm-sans-semibold">
                Alertes
              </h2>

              <button
                onClick={markAllAsRead}
                className="underline text-sm dm-sans-medium cursor-pointer hover:text-muted-foreground transition-colors text-foreground"
              >
                Mark all as read
              </button>
            </div>
            <button
              onClick={() => setIsAlertPanelOpen(false)}
              className="h-10 w-10 flex items-center justify-center border border-border hover:bg-muted cursor-pointer rounded-full transition-colors absolute right-1 top-1 text-foreground"
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
            <div className="w-full border-b border-b-2 border-border px-8 flex items-center justify-between shrink-0">
              <div className="flex items-start gap-4">
                <div
                  onClick={() => setActiveTab("all")}
                  className={`pb-2 px-2 cursor-pointer transition-colors dm-sans-medium flex items-center justify-center gap-2 border-b-3 ${activeTab === "all"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <div className="">All</div>{" "}
                  <div
                    className={`px-2 text-xs rounded-sm ${activeTab === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {alerts.length}
                  </div>
                </div>
                <div
                  onClick={() => setActiveTab("unread")}
                  className={`pb-2 px-2 cursor-pointer transition-colors dm-sans-medium flex items-center justify-center gap-2 border-b-3 ${activeTab === "unread"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <div className="">Unread</div>{" "}
                  <div
                    className={`px-2 text-xs rounded-sm ${activeTab === "unread"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
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
                  className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
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
                <div className="p-8 text-center text-muted-foreground">
                  Aucune alerte pour le moment.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`px-8 py-4 grid grid-cols-[40px_1fr] gap-2 border-b border-border cursor-pointer hover:bg-muted/50 ${alert.isRead ? "bg-card" : "bg-orange-50 dark:bg-orange-900/10"
                      }`}
                    onClick={() => !alert.isRead && markAsRead(alert.id)}
                  >
                    <div className="profile-icon rounded-lg h-[40px] w-[40px] bg-muted bg-[url(/src/assets/profil-bg.png)] bg-cover bg-center relative">
                      {!alert.isRead && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-foreground font-regular text-sm">
                        {/* Render message securely or use a helper to format payload */}
                        {alert.payload.message || JSON.stringify(alert.payload)}
                      </div>
                      <div className="text-xs text-muted-foreground">
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

      <AddSkillDialog
        open={isAddSkillDialogOpen}
        onOpenChange={(open) => {
          setIsAddSkillDialogOpen(open);
          if (!open) {
            // Refresh skills when dialog closes
            getAllSkills()
              .then(setSkills)
              .catch(err => console.error("Failed to refresh skills", err));
          }
        }}
      />
    </div >
  );
};

export default Layout;
