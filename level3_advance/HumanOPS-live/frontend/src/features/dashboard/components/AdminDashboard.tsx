import { useEffect, useState } from "react";
import { StatsCard } from "../../../components/common/StatsCard";
import { DataCard } from "../../../components/common/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Keep for now if needed, or remove later
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllUsersWithStates } from "../../rh/services/rhService";
import { getAllTeamsWithDetails } from "../../rh/services/rhService";
import { getReinforcementRequests } from "../../team/services/teamService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    activeRequests: 0,
    availableUsers: 0,
    overloadedUsers: 0,
    criticalTeams: 0,
  });
  const [usersByRole, setUsersByRole] = useState<any[]>([]);
  const [teamTensions, setTeamTensions] = useState<any[]>([]);
  const [workloadDistribution, setWorkloadDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [users, teams, requests] = await Promise.all([
        getAllUsersWithStates(),
        getAllTeamsWithDetails(),
        getReinforcementRequests(),
      ]);

      // Calculate statistics
      const totalUsers = users.length;
      const totalTeams = teams.length;
      const activeRequests = requests.filter(
        (r) => r.status === "PENDING"
      ).length;
      const availableUsers = users.filter(
        (u) => u.humanState?.availability === "AVAILABLE"
      ).length;
      const overloadedUsers = users.filter(
        (u) => u.humanState?.workload === "HIGH"
      ).length;
      const criticalTeams = teams.filter(
        (t) =>
          t.currentTension?.level === "CRITICAL" ||
          t.currentTension?.level === "HIGH"
      ).length;

      setStats({
        totalUsers,
        totalTeams,
        activeRequests,
        availableUsers,
        overloadedUsers,
        criticalTeams,
      });

      // Users by role
      const roleCount = users.reduce((acc: any, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setUsersByRole([
        { name: "Admin RH", value: roleCount.ADMIN_RH || 0, color: "#ef4444" },
        { name: "Managers", value: roleCount.MANAGER || 0, color: "#f97316" },
        {
          name: "Collaborateurs",
          value: roleCount.COLLABORATOR || 0,
          color: "#3b82f6",
        },
      ]);

      // Team tensions
      const tensionCount = teams.reduce((acc: any, team) => {
        const level = team.currentTension?.level || "UNKNOWN";
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      setTeamTensions([
        { name: "Faible", value: tensionCount.LOW || 0 },
        { name: "Modérée", value: tensionCount.MODERATE || 0 },
        { name: "Élevée", value: tensionCount.HIGH || 0 },
        { name: "Critique", value: tensionCount.CRITICAL || 0 },
      ]);

      // Workload distribution
      const workloadCount = users.reduce((acc: any, user) => {
        const workload = user.humanState?.workload || "UNKNOWN";
        acc[workload] = (acc[workload] || 0) + 1;
        return acc;
      }, {});

      setWorkloadDistribution([
        { name: "Faible", value: workloadCount.LOW || 0 },
        { name: "Normal", value: workloadCount.NORMAL || 0 },
        { name: "Élevé", value: workloadCount.HIGH || 0 },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#22c55e", "#eab308", "#f97316", "#ef4444"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-500">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
            Tableau de Bord Admin RH
          </h1>
          <p className="text-neutral-300">
            Vue d'ensemble de la plateforme HumanOps Live
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Utilisateurs Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {stats.availableUsers} disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Équipes Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              {stats.totalTeams}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {stats.criticalTeams} en tension
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-600">
              Demandes de Renfort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              {stats.activeRequests}
            </div>
            <p className="text-xs text-neutral-500 mt-1">En attente</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par Rôle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={usersByRole}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Tensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tensions des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamTensions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#171717" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution de la Charge</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} />
                <YAxis stroke="#737373" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {workloadDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">
                      Utilisateurs Disponibles
                    </div>
                    <div className="text-2xl font-bold dm-sans-bold text-green-700">
                      {stats.availableUsers}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {((stats.availableUsers / stats.totalUsers) * 100).toFixed(0)}
                  %
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">
                      Utilisateurs Surchargés
                    </div>
                    <div className="text-2xl font-bold dm-sans-bold text-red-700">
                      {stats.overloadedUsers}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-red-600 font-medium">
                  {((stats.overloadedUsers / stats.totalUsers) * 100).toFixed(
                    0
                  )}
                  %
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-600">
                      Équipes en Tension
                    </div>
                    <div className="text-2xl font-bold dm-sans-bold text-orange-700">
                      {stats.criticalTeams}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-orange-600 font-medium">
                  {((stats.criticalTeams / stats.totalTeams) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
