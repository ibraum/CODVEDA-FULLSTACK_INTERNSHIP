import { ICollaboratorProfileRepository } from '../../domain/repositories/ICollaboratorProfileRepository';
import { ISkillRepository } from '../../domain/repositories/ISkillRepository';

export class AddSkillUseCase {
  constructor(
    private profileRepository: ICollaboratorProfileRepository,
    private skillRepository: ISkillRepository
  ) {}

  async execute(userId: string, skillName: string): Promise<void> {
    // 1. Récupérer ou créer le profil
    let profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      // Création auto d'un profil vide si inexistant
      profile = await this.profileRepository.create({ userId, preferences: {} });
    }

    // 2. Trouver ou créer la compétence
    let skill = await this.skillRepository.findByName(skillName);
    if (!skill) {
      skill = await this.skillRepository.create({ name: skillName });
    }

    // 3. Associer
    // Vérifier si déjà associé ? Le repo le gérera ou try/catch
    try {
      await this.profileRepository.addSkill(profile.id, skill.id);
    } catch (e) {
      // Ignorer si déjà existant
    }
  }
}
