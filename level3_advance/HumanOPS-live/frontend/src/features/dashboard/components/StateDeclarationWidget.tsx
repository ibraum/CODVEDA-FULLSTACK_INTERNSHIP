import { useState, useEffect } from "react";
import {
  getMyState,
  updateMyState,
} from "../../humanState/services/humanStateService";
import type { HumanState } from "../../humanState/services/humanStateService";
import { cn } from "../../../lib/utils";
import {
  SunIcon,
  CloudIcon,
  BoltIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { motion, LayoutGroup } from "framer-motion";

const StateDeclarationWidget = () => {
  const [state, setState] = useState<HumanState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const data = await getMyState();
      setState(data);
    } catch (error) {
      console.error("Failed to fetch state", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleUpdate = async (
    field: "workload" | "availability",
    value: string
  ) => {
    // Determine the new state, using defaults if state is null
    const currentState = state || {
      id: "temp-id", // Placeholder, won't be sent to backend usually if we send partial
      userId: "temp-user",
      workload: "NORMAL",
      availability: "AVAILABLE",
      updatedAt: new Date().toISOString(),
    };

    const previousState = state;

    // Optimistic update
    setState({ ...currentState, [field]: value });

    try {
      const updatedState = await updateMyState({ [field]: value } as any);
      setState(updatedState);
    } catch (error) {
      console.error("Failed to update state", error);
      setState(previousState);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 animate-pulse h-64" />
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-6">
      <div className="">
        <h3 className="text-xl font-bold dm-sans-bold text-neutral-900 tracking-tight">
          État Actuel
        </h3>
        <p className="text-neutral-400 text-sm dm-sans-medium mt-1">
          Déclarez votre état pour l'équipe.
        </p>
      </div>

      <div className="space-y-6">
        {/* ================= Workload ================= */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 block pl-1 dm-sans-bold">
            Charge de travail
          </label>

          <div className="bg-neutral-100 p-1 rounded-xl flex gap-1 relative">
            <LayoutGroup id="workload">
              {[
                { value: "LOW", label: "Faible", Icon: SunIcon },
                { value: "NORMAL", label: "Normale", Icon: CloudIcon },
                { value: "HIGH", label: "Élevée", Icon: BoltIcon },
              ].map((option) => {
                const isActive = (state?.workload ?? "NORMAL") === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleUpdate("workload", option.value)}
                    className={cn(
                      "flex-1 relative isolate overflow-hidden flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="workload-bg"
                        className="absolute inset-0 bg-neutral-900 rounded-lg shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex flex-col items-center gap-1.5">
                      <option.Icon className="w-5 h-5" />
                      <span className="text-[11px] font-semibold dm-sans-bold uppercase tracking-wide">
                        {option.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </div>

        {/* ================= Availability ================= */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 block pl-1 dm-sans-bold">
            Disponibilité
          </label>

          <div className="bg-neutral-100 p-1 rounded-xl flex gap-1 relative">
            <LayoutGroup id="availability">
              {[
                {
                  value: "AVAILABLE",
                  label: "Dispo",
                  Icon: CheckCircleIcon,
                  color: "text-green-500",
                },
                {
                  value: "MOBILISABLE",
                  label: "Mobilisable",
                  Icon: HandRaisedIcon,
                  color: "text-orange-500",
                },
                {
                  value: "UNAVAILABLE",
                  label: "Occupé",
                  Icon: NoSymbolIcon,
                  color: "text-red-500",
                },
              ].map((option) => {
                const isActive =
                  (state?.availability ?? "AVAILABLE") === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleUpdate("availability", option.value)}
                    className={cn(
                      "flex-1 relative isolate overflow-hidden flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="availability-bg"
                        className="absolute inset-0 bg-neutral-900 rounded-lg shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <option.Icon className="w-5 h-5" />
                        {!isActive && (
                          <div
                            className={cn(
                              "absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-current",
                              option.color
                            )}
                          />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold dm-sans-bold uppercase tracking-wide">
                        {option.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateDeclarationWidget;
