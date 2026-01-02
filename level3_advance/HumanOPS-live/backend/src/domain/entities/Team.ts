export interface Team {
  id: string;
  name: string;
  managerId: string;
  createdAt: Date;
}

export interface CreateTeamDTO {
  name: string;
  managerId: string;
}

export interface UpdateTeamDTO {
  name?: string;
  managerId?: string;
}
