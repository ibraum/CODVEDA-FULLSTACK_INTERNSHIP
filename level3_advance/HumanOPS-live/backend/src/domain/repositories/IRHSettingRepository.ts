import { RHSetting, CreateSettingDTO, UpdateSettingDTO } from '../entities/RHSetting.js';

export interface IRHSettingRepository {
  create(data: CreateSettingDTO): Promise<RHSetting>;
  findByKey(key: string): Promise<RHSetting | null>;
  findAll(): Promise<RHSetting[]>;
  update(key: string, data: UpdateSettingDTO): Promise<RHSetting>;
}
