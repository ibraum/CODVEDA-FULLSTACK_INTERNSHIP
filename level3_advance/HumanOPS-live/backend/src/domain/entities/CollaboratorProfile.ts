export interface CollaboratorProfile {
  id: string;
  userId: string;
  preferences: {
    notifications: boolean;
    workingHours?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDTO {
  userId: string;
  preferences: Record<string, any>;
}

export interface UpdateProfileDTO {
  preferences?: Record<string, any>;
}
