import { IRHSettingRepository } from '../../domain/repositories/IRHSettingRepository';
import { RHSetting } from '../../domain/entities/RHSetting';

export class UpdateRHSettingUseCase {
  constructor(private settingRepository: IRHSettingRepository) {}

  async execute(key: string, value: any, userId: string): Promise<RHSetting> {
    // Vérifier l'existence ou créer directement ?
    // Dans notre logique, le repository update gère l'historique, donc il faut que ça existe.
    // On pourrait ajouter un 'upsert' logique ici.
    
    const existing = await this.settingRepository.findByKey(key);
    
    if (!existing) {
      return await this.settingRepository.create({
        key,
        value,
        updatedBy: userId,
      });
    }

    return await this.settingRepository.update(key, {
      value,
      updatedBy: userId,
    });
  }
}
