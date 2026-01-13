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
      LOW: "bg-green-100 text-green-800 hover:bg-green-100",
      MODERATE: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      HIGH: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
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
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
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

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-neutral-300 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <p className="text-neutral-500 font-medium">
              Aucune équipe disponible
            </p>
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
    (req) => req.status === "PENDING"
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vue d'ensemble des équipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                {totalTeams}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Équipes
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                {totalMembers}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Collaborateurs
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-red-600">
                {criticalTeams}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Équipes en tension
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              selectedTeam === team.id
                ? "bg-neutral-900 text-white shadow-md"
                : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            )}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Selected Team Details */}
      {selectedTeamData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tension Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Évolution de la tension
                </CardTitle>
                {selectedTeamData.currentTension && (
                  <Badge
                    className={getTensionColor(
                      selectedTeamData.currentTension.level
                    )}
                  >
                    {getTensionLabel(selectedTeamData.currentTension.level)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="time" stroke="#737373" fontSize={12} />
                    <YAxis stroke="#737373" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tension"
                      stroke="#171717"
                      strokeWidth={2}
                      dot={{ fill: "#171717", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-neutral-400 text-sm">
                  Aucune donnée de tension disponible
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Informations de l'équipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">
                    Nom de l'équipe
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {selectedTeamData.name}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">Manager ID</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedTeamData.managerId}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">Membres</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedTeamData.memberCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-600">
                    Demandes de renfort
                  </span>
                  <span className="font-semibold text-orange-600">
                    {selectedTeamData.pendingReinforcementRequests || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reinforcement Requests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold dm-sans-bold text-neutral-900 flex items-center gap-2">
          Demandes de Renfort Actives
          {teamRequests.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {teamRequests.length}
            </span>
          )}
        </h3>

        {teamRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-neutral-300 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900">
              Aucune demande urgente
            </h3>
            <p className="text-neutral-500 text-sm mt-1 max-w-xs mx-auto">
              Tout va bien ! Aucune équipe n'a besoin de renfort pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamRequests.map((request) => {
              const requestTeam = teams.find((t) => t.id === request.teamId);
              return (
                <div
                  key={request.id}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-1.5 h-full",
                      request.urgencyLevel >= 8
                        ? "bg-red-500"
                        : request.urgencyLevel >= 5
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    )}
                  ></div>
                  <div className="pl-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-neutral-900 text-lg">
                          {requestTeam?.name || "Équipe"}
                        </h4>
                        <p className="text-sm text-neutral-500">
                          Compétences requises :{" "}
                          {Object.keys(request.requiredSkills || {}).join(
                            ", "
                          ) || "N/A"}
                        </p>
                      </div>
                      <div className="bg-neutral-100 text-neutral-600 text-xs font-medium px-2 py-1 rounded-md">
                        Urgence {request.urgencyLevel}/10
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">
                        Expire:{" "}
                        {new Date(request.expiresAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                      <span className="text-xs font-medium text-neutral-600">
                        Status: {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsTab;
