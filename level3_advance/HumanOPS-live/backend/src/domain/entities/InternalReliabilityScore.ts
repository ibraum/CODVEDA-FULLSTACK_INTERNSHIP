export interface InternalReliabilityScore {
  id: string;
  userId: string;
  score: number; // 0.4 à 1.0
  calculatedAt: Date;
  factors: {
    declarativeConsistency: number; // Cohérence déclarations
    responsiveness: number; // Réactivité aux renforts
    stability: number; // Stabilité des états
  };
}

export interface CreateReliabilityScoreDTO {
  userId: string;
  score: number;
  factors: any;
}
