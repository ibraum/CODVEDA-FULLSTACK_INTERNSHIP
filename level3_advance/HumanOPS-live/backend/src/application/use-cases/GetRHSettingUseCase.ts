import { IRHSettingRepository } from '../../domain/repositories/IRHSettingRepository.js';
import { RHSetting } from '../../domain/entities/RHSetting.js';

export class GetRHSettingUseCase {
  constructor(private settingRepository: IRHSettingRepository) {}

  async execute(key?: string): Promise<RHSetting | RHSetting[]> {
    if (key) {
      const setting = await this.settingRepository.findByKey(key);
      if (!setting) throw new Error('Setting not found');
      return setting;
    }
    return await this.settingRepository.findAll();
  }
}
