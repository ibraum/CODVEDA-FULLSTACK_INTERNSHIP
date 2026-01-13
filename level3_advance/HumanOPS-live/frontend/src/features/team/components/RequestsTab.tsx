import { useEffect, useState } from "react";
import { getReinforcementRequests } from "../../team/services/teamService";
import type { ReinforcementRequest } from "../../team/services/teamService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CreateRequestDialog from "./CreateRequestDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "../../auth/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RequestsTab = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ReinforcementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getReinforcementRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch reinforcement requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleUpdate = () => {
      fetchRequests();
    };

    window.addEventListener("reinforcementRequestUpdate", handleUpdate);
    return () => {
      window.removeEventListener("reinforcementRequestUpdate", handleUpdate);
    };
  }, []);

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }


  const getUrgencyLabel = (level: number) => {
    if (level <= 3) return "Faible";
    if (level <= 7) return "Moyenne";
    return "Urgente";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30";
      case "CLOSED":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const chartData = [
    {
      name: "Ouvertes",
      count: requests.filter((r) => r.status === "OPEN").length,
    },
    {
      name: "Fermées",
      count: requests.filter((r) => r.status === "CLOSED").length,
    },
    {
      name: "Urgentes",
      count: requests.filter((r) => r.urgencyLevel > 7).length,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
              Gestion des Demandes
            </h1>
            <p className="text-neutral-300">
              Suivez et gérez les demandes de renfort pour votre équipe
            </p>
          </div>
          <CreateRequestDialog onSuccess={fetchRequests}>
            <button className="hidden md:flex bg-orange-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-orange-700 cursor-pointer transition-colors items-center gap-2 shadow-sm">
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
              Nouvelle demande
            </button>
          </CreateRequestDialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-neutral-900/10 dark:bg-white/5 group-hover:bg-neutral-900/20 dark:group-hover:bg-white/10 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Demandes</p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">{requests.length}</div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-foreground"></span>
              </div>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-foreground rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-green-500/20 group-hover:bg-green-500/30 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">En cours</p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {requests.filter((r) => r.status === "OPEN").length}
                </div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(requests.filter((r) => r.status === "OPEN").length / (requests.length || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-red-500/20 group-hover:bg-red-500/30 transition-colors blur-xl z-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Urgentes</p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {requests.filter((r) => r.urgencyLevel > 7).length}
                </div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              </div>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-auto">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${(requests.filter((r) => r.urgencyLevel > 7).length / (requests.length || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "var(--foreground)",
                    }}
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry.name === "Urgentes" ? "#ef4444" :
                          entry.name === "Ouvertes" ? "#22c55e" :
                            "var(--foreground)"
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des demandes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto text-muted-foreground mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              <p className="text-muted-foreground font-medium">
                Aucune demande en cours
              </p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                Les demandes de renfort apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-muted/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {request.team && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30">
                          {request.team.name}
                        </span>
                      )}
                      <span
                        className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border",
                          getStatusColor(request.status))}
                      >
                        {request.status}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-semibold text-foreground group-hover:text-orange-600 transition-colors">
                        Demande de Renfort
                      </h4>
                      {request.urgencyLevel > 7 && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </div>

                    {Object.keys(request.requiredSkills).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Object.keys(request.requiredSkills).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium border border-border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Priorité</div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={cn("text-sm font-bold",
                          request.urgencyLevel > 7 ? "text-red-600" :
                            request.urgencyLevel > 4 ? "text-orange-600" : "text-blue-600"
                        )}>
                          {getUrgencyLabel(request.urgencyLevel)}
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={cn("h-1.5 w-1.5 rounded-full",
                              i < Math.ceil(request.urgencyLevel / 2) ?
                                (request.urgencyLevel > 7 ? "bg-red-500" : "bg-foreground") :
                                "bg-muted"
                            )}></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {(user?.role === "MANAGER" || user?.role === "ADMIN_RH") && (
                      <div className="flex items-center gap-2 pl-4 border-l border-border">
                        <CreateRequestDialog onSuccess={fetchRequests} requestToEdit={request}>
                          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                        </CreateRequestDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Cette demande de renfort sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await deleteReinforcementRequest(request.id);
                                    fetchRequests();
                                  } catch (err) {
                                    console.error("Failed to delete", err);
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsTab;
