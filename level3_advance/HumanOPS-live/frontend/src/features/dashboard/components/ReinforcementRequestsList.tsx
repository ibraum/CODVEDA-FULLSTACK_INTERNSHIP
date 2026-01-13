import { useState, useEffect } from "react";
import {
  getOpenReinforcementRequests, respondToReinforcement,
} from "../../reinforcement/services/reinforcementService";
import type { ReinforcementRequest } from "../../reinforcement/services/reinforcementService";
import { cn } from "../../../lib/utils";

const ReinforcementRequestsList = () => {
  const [requests, setRequests] = useState<ReinforcementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await getOpenReinforcementRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch reinforcement requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Ideally subscribe to socket events here for real-time updates
  }, []);

  const handleRespond = async (requestId: string) => {
    setRespondingTo(requestId);
    try {
      await respondToReinforcement(requestId, "ACCEPTED");
      // Remove the request from the list or mark as accepted
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      alert("Mission acceptée ! Merci pour votre solidarité.");
    } catch (error) {
      console.error("Failed to respond", error);
      alert("Erreur lors de l'acceptation de la mission.");
    } finally {
      setRespondingTo(null);
    }
  };

  if (loading) return <div>Chargement des demandes...</div>;

  if (requests.length === 0) {
    return (
      <div className="bg-card p-8 rounded-2xl border border-dashed border-border text-center flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
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
        <h3 className="text-lg font-medium text-foreground">
          Aucune demande urgente
        </h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
          Tout va bien ! Aucune équipe n'a besoin de renfort pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold dm-sans-bold text-foreground flex items-center gap-2">
        Demandes de Renfort
        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
          {requests.length}
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
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
                  <h4 className="font-semibold text-foreground text-lg">
                    Renfort Équipe A
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Compétences requises : React, Node.js
                  </p>
                </div>
                <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-md">
                  Urgence {request.urgencyLevel}/10
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Expire dans 2h</span>
                <button
                  onClick={() => handleRespond(request.id)}
                  disabled={respondingTo === request.id}
                  className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {respondingTo === request.id
                    ? "Acceptation..."
                    : "Accepter la mission"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReinforcementRequestsList;
