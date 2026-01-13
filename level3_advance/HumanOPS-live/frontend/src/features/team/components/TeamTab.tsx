import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  getTeams,
  getTeamDetails,
  getTeamTensions,
  type Team,
  type TensionSnapshot,
  type TeamMemberWithState,
  type Manager,
} from "../services/teamService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TeamTab = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [manager, setManager] = useState<Manager | null>(null);
  const [members, setMembers] = useState<TeamMemberWithState[]>([]);
  const [tensions, setTensions] = useState<TensionSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all teams (accessible to all authenticated users)
        const teams = await getTeams();


        // Find user's team
        let userTeamId = user?.teamId;

        // Fallback: use first team if no teamId (legacy/dev behavior)
        if (!userTeamId && teams.length > 0) {
          userTeamId = teams[0].id;
        }

        if (!userTeamId) {
          setLoading(false);
          return;
        }

        // Fetch full team details
        const details = await getTeamDetails(userTeamId);

        setTeam(details.team);
        setManager(details.manager);
        setMembers(details.members);

        // Fetch tensions only for managers/admin
        if (["MANAGER", "ADMIN_RH"].includes(user?.role || "")) {
          const tensionHistory = await getTeamTensions(userTeamId);
          setTensions(tensionHistory);
        } else {
          setTensions([]);
        }

      } catch (err: any) {
        console.error("Failed to fetch team data", err);
        setError("Impossible de charger les données de l'équipe");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user]);

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
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-48" />
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

  if (!team) {
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
              Vous n'êtes assigné à aucune équipe
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = tensions
    .map((t) => ({
      time: new Date(t.calculatedAt).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      }),
      tension: getTensionValue(t.level),
    }))
    .reverse();

  const currentTension = tensions[0];

  // Helper functions
  function getTensionValue(level: string): number {
    const map: Record<string, number> = {
      LOW: 25,
      MODERATE: 50,
      HIGH: 75,
      CRITICAL: 95,
    };
    return map[level] || 0;
  }

  function getTensionColor(level: string): string {
    const map: Record<string, string> = {
      LOW: "bg-green-100 text-green-800 hover:bg-green-100",
      MODERATE: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      HIGH: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      CRITICAL: "bg-red-100 text-red-800 hover:bg-red-100",
    };
    return map[level] || "bg-neutral-100 text-neutral-800";
  }

  function getTensionLabel(level: string): string {
    const map: Record<string, string> = {
      LOW: "Faible",
      MODERATE: "Modérée",
      HIGH: "Élevée",
      CRITICAL: "Critique",
    };
    return map[level] || "Inconnue";
  }

  function getWorkloadColor(workload: string): string {
    const map: Record<string, string> = {
      LOW: "bg-green-500",
      NORMAL: "bg-blue-500",
      HIGH: "bg-red-500",
    };
    return map[workload] || "bg-neutral-500";
  }

  function getAvailabilityIcon(availability: string): string {
    const map: Record<string, string> = {
      AVAILABLE: "✓",
      MOBILISABLE: "~",
      UNAVAILABLE: "✗",
    };
    return map[availability] || "?";
  }

  // Calculate statistics
  const totalMembers = members.length;
  const availableMembers = members.filter(
    (m) => m.humanState?.availability === "AVAILABLE"
  ).length;
  const overloadedMembers = members.filter(
    (m) => m.humanState?.workload === "HIGH"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Team Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{team.name}</CardTitle>
              <p className="text-neutral-500 text-sm mt-1">
                Manager:{" "}
                {manager
                  ? `${manager.firstName || ""} ${manager.lastName || ""
                    }`.trim() || manager.email
                  : "Chargement..."}
              </p>
            </div>
            {currentTension && (
              <Badge className={getTensionColor(currentTension.level)}>
                Tension: {getTensionLabel(currentTension.level)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-100 rounded-2xl p-4 text-center relative overflow-hidden">

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-2 right-2 text-orange-600 font-bold z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>

              <div className="absolute top-0 right-0 h-20 w-20 rounded-[12px_12px_12px_50%] bg-gradient-to-tr from-transparent to-orange-600 blur-xl z-0"></div>
              <div className="absolute top-2 left-2 h-15 w-15 border border-neutral-100 bg-white rounded-2xl flex items-center justify-center">
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
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                {totalMembers}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Membres
              </div>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                {availableMembers}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Disponibles
              </div>
            </div>

            {["MANAGER", "ADMIN_RH"].includes(user?.role || "") ? (
              <div className="bg-neutral-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                  {overloadedMembers}
                </div>
                <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                  Surchargés
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-2xl p-4 text-center opacity-50">
                <div className="text-xl font-bold dm-sans-bold text-neutral-400 mt-1">
                  -
                </div>
                <div className="text-xs text-neutral-400 mt-2 uppercase tracking-wider">
                  Surchargés
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tension Chart */}
      {
        tensions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évolution de la tension</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )
      }

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Membres de l'équipe</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center text-neutral-500 py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto mb-3 text-neutral-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <p className="font-medium mb-1">Informations restreintes</p>
              <p className="text-sm">
                Les détails des membres et les statistiques de l'équipe sont
                accessibles uniquement aux managers et administrateurs RH.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Employé (Nom & Prénoms)</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-center">Disponibilité</TableHead>
                  {["MANAGER", "ADMIN_RH"].includes(user?.role || "") && (
                    <TableHead className="text-center">Charge</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, i) => {
                  const initials =
                    `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""
                      }`.toUpperCase() || member.email[0].toUpperCase();

                  return (
                    <TableRow key={member.id}>
                      <TableCell>{i+1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-none">
                            <AvatarFallback className="text-xs bg-neutral-900 text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{member.lastName ? member.lastName : "---"} {member.firstName ? member.firstName : "---"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {member.email}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {member.role.replace('_', ' ')}
                      </TableCell>

                      <TableCell className="text-center">
                        {member.humanState ? (
                          <Badge
                            variant="outline"
                            className={
                              member.humanState.availability === "AVAILABLE" ? "bg-green-50 text-green-700 border-green-200" :
                                member.humanState.availability === "MOBILISABLE" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                  "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {member.humanState.availability === "AVAILABLE" ? "Disponible" :
                              member.humanState.availability === "MOBILISABLE" ? "Mobilisable" : "Indisponible"}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      {["MANAGER", "ADMIN_RH"].includes(user?.role || "") && (
                        <TableCell className="text-center">
                          {member.humanState ? (
                            <Badge
                              variant="outline"
                              className={
                                member.humanState.workload === "LOW" ? "bg-green-100 text-green-800 border-green-200" :
                                  member.humanState.workload === "NORMAL" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                    "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {member.humanState.workload}
                            </Badge>
                          ) : "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div >
  );
};

export default TeamTab;
