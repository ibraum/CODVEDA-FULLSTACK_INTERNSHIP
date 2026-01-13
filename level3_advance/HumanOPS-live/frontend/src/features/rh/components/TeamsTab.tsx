import { useEffect, useState } from "react";
import {
  getAllTeamsWithDetails,
  type TeamWithDetails,
} from "../../rh/services/rhService";
import {
  getTeamTensions,
  type TensionSnapshot,
} from "../../team/services/teamService";
import {
  getReinforcementRequests,
  type ReinforcementRequest,
} from "../../team/services/teamService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TeamsTab = () => {
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [tensions, setTensions] = useState<Record<string, TensionSnapshot[]>>(
    {}
  );
  const [reinforcementRequests, setReinforcementRequests] = useState<
    ReinforcementRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchReinforcementRequests();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamTensions(selectedTeam);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsData = await getAllTeamsWithDetails();
      setTeams(teamsData);
      if (teamsData.length > 0 && !selectedTeam) {
        setSelectedTeam(teamsData[0].id);
      }
    } catch (err: any) {
      console.error("Failed to fetch teams", err);
      setError("Impossible de charger les équipes");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamTensions = async (teamId: string) => {
    try {
      const tensionsData = await getTeamTensions(teamId, 10);
      setTensions((prev) => ({ ...prev, [teamId]: tensionsData }));
    } catch (err: any) {
      console.error("Failed to fetch team tensions", err);
    }
  };

  const fetchReinforcementRequests = async () => {
    try {
      const requestsData = await getReinforcementRequests();
      setReinforcementRequests(requestsData);
    } catch (err: any) {
      console.error("Failed to fetch reinforcement requests", err);
    }
  };

  const getTensionColor = (level: string): string => {
    const map: Record<string, string> = {
      LOW: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      MODERATE: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
      HIGH: "bg-orange-500 text-white hover:bg-orange-600 border-orange-600",
      CRITICAL: "bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900",
    };
    return map[level] || "bg-neutral-100 text-neutral-800";
  };

  const getTensionLabel = (level: string): string => {
    const map: Record<string, string> = {
      LOW: "Faible",
      MODERATE: "Modérée",
      HIGH: "Élevée",
      CRITICAL: "Critique",
    };
    return map[level] || "Inconnue";
  };

  const getTensionValue = (level: string): number => {
    const map: Record<string, number> = {
      LOW: 25,
      MODERATE: 50,
      HIGH: 75,
      CRITICAL: 95,
    };
    return map[level] || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall statistics
  const totalTeams = teams.length;
  const totalMembers = teams.reduce(
    (sum, team) => sum + (team.memberCount || 0),
    0
  );
  const criticalTeams = teams.filter(
    (team) =>
      team.currentTension?.level === "CRITICAL" ||
      team.currentTension?.level === "HIGH"
  ).length;

  const selectedTeamData = teams.find((t) => t.id === selectedTeam);
  const selectedTeamTensions = selectedTeam ? tensions[selectedTeam] || [] : [];

  // Prepare chart data
  const chartData = selectedTeamTensions
    .map((t) => ({
      time: new Date(t.calculatedAt).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      }),
      tension: getTensionValue(t.level),
    }))
    .reverse();

  // Filter requests for teams
  const teamRequests = reinforcementRequests.filter(
    (req) => req.status === "OPEN" // Changed PENDING to OPEN based on backend enum fix
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
              Gestion des Équipes
            </h1>
            <p className="text-neutral-300">
              Supervisez les équipes, surveillez les tensions et gérez les renforts
            </p>
          </div>
          <button
            onClick={() => setIsAddTeamDialogOpen(true)}
            className="hidden md:flex bg-orange-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-orange-700 cursor-pointer transition-colors items-center gap-2 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Créer une équipe
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Teams */}
        <div className="border border-neutral-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-neutral-900/10 group-hover:bg-neutral-900/15 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  Total Équipes
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">
                  {totalTeams}
                </div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-neutral-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Members */}
        <div className="border border-neutral-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  Collaborateurs
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">
                  {totalMembers}
                </div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Teams */}
        <div className="border border-neutral-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  En Tension
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">
                  {criticalTeams}
                </div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-orange-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width: `${(criticalTeams / (totalTeams || 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-neutral-300 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Aucune équipe
          </h3>
          <p className="text-neutral-500 max-w-sm mx-auto mb-6">
            Commencez par créer des équipes pour organiser vos collaborateurs et
            suivre leurs performances.
          </p>
          <button
            onClick={() => setIsAddTeamDialogOpen(true)}
            className="bg-neutral-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Créer la première équipe
          </button>
        </div>
      ) : (
        <>
          {/* Main Layout: Sidebar List vs Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar: Team List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 px-1">
                Liste des équipes
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                      selectedTeam === team.id
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-lg"
                        : "bg-white border-neutral-200 text-neutral-700 hover:border-orange-200 hover:shadow-sm"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <span className="font-bold text-lg truncate pr-2">
                        {team.name}
                      </span>
                      {team.currentTension && (
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full mt-1.5",
                            team.currentTension.level === "CRITICAL"
                              ? "bg-red-500 animate-pulse"
                              : team.currentTension.level === "HIGH"
                                ? "bg-orange-500"
                                : "bg-green-500"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs relative z-10 opacity-90">
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3 h-3"
                        >
                          <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .358-.442 3 3 0 0 0-4.308-3.516 6.484 6.484 0 0 1 1.905 3.959c.023.222.014.442-.025.654ZM9 12a1 1 0 0 1 1.41-1.41c1.58.33 3.033 1.05 4.232 2.066a19.101 19.101 0 0 1-5.642 0A9.97 9.97 0 0 0 9 12Z" />
                        </svg>
                        {team.memberCount || 0}
                      </span>
                      <span>
                        {team.currentTension?.level === "CRITICAL"
                          ? "Critique"
                          : team.currentTension?.level === "HIGH"
                            ? "Tension"
                            : "Stable"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content: Selected Team Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedTeamData && (
                <>
                  {/* Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team Info Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>Informations</span>
                          {selectedTeamData.currentTension && (
                            <Badge
                              className={getTensionColor(
                                selectedTeamData.currentTension.level
                              )}
                            >
                              {getTensionLabel(
                                selectedTeamData.currentTension.level
                              )}
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mt-2">
                          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                            <span className="text-sm text-neutral-600">
                              Manager
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold">
                                M
                              </div>
                              <span className="font-semibold text-neutral-900 text-sm">
                                {selectedTeamData.manager?.firstName || "N/A"}{" "}
                                {selectedTeamData.manager?.lastName || ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                            <span className="text-sm text-neutral-600">
                              Demandes
                            </span>
                            <span className="font-semibold text-orange-600">
                              {selectedTeamData.pendingReinforcementRequests ||
                                0}{" "}
                              en attente
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chart Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Tension (10j)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {chartData.length > 0 ? (
                          <div className="h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <Line
                                  type="monotone"
                                  dataKey="tension"
                                  stroke="#f97316"
                                  strokeWidth={3}
                                  dot={{ fill: "#f97316", r: 4, stroke: "#fff", strokeWidth: 2 }}
                                />
                                <Tooltip
                                  cursor={{ stroke: "#e5e5e5" }}
                                  contentStyle={{
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="h-[140px] flex items-center justify-center text-neutral-400 text-sm">
                            Pas de données
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Reinforcement Requests for this team */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Demandes de Renfort
                    </h3>
                    {teamRequests.filter((r) => r.teamId === selectedTeam)
                      .length === 0 ? (
                      <div className="bg-neutral-50 rounded-xl p-8 text-center border border-neutral-100">
                        <p className="text-neutral-500 text-sm">
                          Aucune demande active pour cette équipe.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {teamRequests
                          .filter((r) => r.teamId === selectedTeam)
                          .map((request) => (
                            <div
                              key={request.id}
                              className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center font-bold text-white",
                                    request.urgencyLevel >= 8
                                      ? "bg-neutral-900"
                                      : "bg-orange-500"
                                  )}
                                >
                                  {request.urgencyLevel}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-neutral-900">
                                    Besoin de renfort
                                  </h4>
                                  <p className="text-xs text-neutral-500">
                                    Skills:{" "}
                                    {Object.keys(
                                      request.requiredSkills || {}
                                    ).join(", ")}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-neutral-50">
                                {new Date(request.createdAt).toLocaleDateString(
                                  "fr-FR", { day: 'numeric', month: 'short' }
                                )}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add Team Dialog Placeholder */}
      <Dialog
        open={isAddTeamDialogOpen}
        onOpenChange={setIsAddTeamDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl dm-sans-bold">
              Créer une équipe
            </DialogTitle>
            <DialogDescription>
              Cette fonctionnalité sera disponible dans une prochaine mise à jour.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsTab;
