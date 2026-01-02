export interface RHSetting {
  id: string;
  key: string;
  value: any;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RHSettingHistory {
  id: string;
  settingId: string;
  key: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedAt: Date;
}

export interface CreateSettingDTO {
  key: string;
  value: any;
  updatedBy: string;
}

export interface UpdateSettingDTO {
  value: any;
  updatedBy: string;
}
