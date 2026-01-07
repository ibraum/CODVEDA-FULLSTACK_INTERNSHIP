import { apiClient } from "../../../lib/axios";

export interface ReinforcementRequest {
  id: string;
  teamId: string;
  requiredSkills: Record<string, number>;
  urgencyLevel: number;
  status: "OPEN" | "CLOSED";
  expiresAt: string;
  createdAt: string;
  team?: {
    name: string;
  };
}

export const createReinforcementRequest = async (data: {
  teamId: string;
  requiredSkills: Record<string, number>;
  urgencyLevel: number;
}): Promise<ReinforcementRequest> => {
  const response = await apiClient.post<{ request: ReinforcementRequest }>(
    "/reinforcements",
    data
  );
  return response.data.request;
};

export const getOpenReinforcementRequests = async (): Promise<
  ReinforcementRequest[]
> => {
  const response = await apiClient.get<{ requests: ReinforcementRequest[] }>(
    "/reinforcements"
  );
  return response.data.requests;
};

export const respondToReinforcement = async (
  requestId: string,
  responseValue: "ACCEPTED" | "REFUSED"
): Promise<void> => {
  await apiClient.post(`/reinforcements/${requestId}/respond`, {
    response: responseValue,
  });
};
