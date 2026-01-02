import { IRHSettingRepository } from '../../domain/repositories/IRHSettingRepository.js';
import { RHSetting, CreateSettingDTO, UpdateSettingDTO } from '../../domain/entities/RHSetting.js';
import { prisma } from './prisma.js';

export class RHSettingRepository implements IRHSettingRepository {
  async create(data: CreateSettingDTO): Promise<RHSetting> {
    return await prisma.rHSetting.create({
      data: {
        key: data.key,
        value: data.value,
        updatedBy: data.updatedBy,
      },
    }) as unknown as RHSetting;
  }

  async findByKey(key: string): Promise<RHSetting | null> {
    return await prisma.rHSetting.findUnique({
      where: { key },
    }) as unknown as RHSetting | null;
  }

  async findAll(): Promise<RHSetting[]> {
    return await prisma.rHSetting.findMany() as unknown as RHSetting[];
  }

  async update(key: string, data: UpdateSettingDTO): Promise<RHSetting> {
    const setting = await this.findByKey(key);
    if (!setting) throw new Error('Setting not found');

    // Maintien de l'historique via transaction ? 
    // Ou Prisma middleware, ou manuellement ici.
    // Le schema Prisma définit 'RHSettingHistory', donc on peut le créer ici.
    
    // Transaction pour l'atomicité
    return await prisma.$transaction(async (tx) => {
      // 1. Créer historique
      await tx.rHSettingHistory.create({
        data: {
          settingId: setting.id,
          key: setting.key,
          oldValue: setting.value,
          newValue: data.value,
          changedBy: data.updatedBy,
        },
      });

      // 2. Update
      return await tx.rHSetting.update({
        where: { key },
        data: {
          value: data.value,
          updatedBy: data.updatedBy,
        },
      });
    }) as unknown as RHSetting;
  }
}
