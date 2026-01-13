import { useEffect, useState } from "react";

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
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
              Tableau de Bord Admin RH
            </h1>
            <p className="text-neutral-300">
              Vue d'ensemble de la plateforme HumanOps Live
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid - Inspired by HistoryTab & TeamTab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Total Users & Availability */}
        <div className="bg-neutral-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Utilisateurs</p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">{stats.totalUsers}</div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> Disponibles
                </span>
                <span className="font-semibold text-neutral-900">{stats.availableUsers}</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.availableUsers / (stats.totalUsers || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams & Status */}
        <div className="bg-neutral-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Équipes</p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">{stats.totalTeams}</div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> Critique / Élevée
                </span>
                <span className="font-semibold text-neutral-900">{stats.criticalTeams}</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.criticalTeams / (stats.totalTeams || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="bg-neutral-100 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Renforts</p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-900 mt-1">{stats.activeRequests}</div>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-neutral-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg>
              </div>
            </div>

            <div className="mt-auto">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {stats.activeRequests > 0 ? "Action requise" : "Tout est calme"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role - Pie Chart */}
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
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  itemStyle={{ color: "#171717", fontWeight: 500 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {usersByRole.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-neutral-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Tensions - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tensions des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamTensions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {teamTensions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === "Critique" ? "#ef4444" :
                        entry.name === "Élevée" ? "#f97316" :
                          entry.name === "Modérée" ? "#eab308" : "#22c55e"
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Distribution - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution de la Charge</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                  }}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {workloadDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Élevé" ? "#ef4444" :
                          entry.name === "Normal" ? "#3b82f6" : "#22c55e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown - Replaces "Quick Stats" */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">État des Ressources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overloaded Users Detail */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Utilisateurs Surchargés</div>
                  <div className="text-xs text-neutral-500">Besoin d'attention</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-red-700">{stats.overloadedUsers}</div>
                <div className="text-xs font-medium text-red-600">
                  {((stats.overloadedUsers / (stats.totalUsers || 1)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Available Users Detail */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-green-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Utilisateurs Disponibles</div>
                  <div className="text-xs text-neutral-500">Prêts pour renfort</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-700">{stats.availableUsers}</div>
                <div className="text-xs font-medium text-green-600">
                  {((stats.availableUsers / (stats.totalUsers || 1)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Critical Teams Detail */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-orange-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-orange-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Équipes Sous Tension</div>
                  <div className="text-xs text-neutral-500">Niveaux critiques</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-700">{stats.criticalTeams}</div>
                <div className="text-xs font-medium text-orange-600">
                  {((stats.criticalTeams / (stats.totalTeams || 1)) * 100).toFixed(0)}%
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
