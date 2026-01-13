import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllSkillsWithCount,
  createSkill,
  deleteSkill,
  type Skill,
} from "../../rh/services/rhService";

const ManageSkillsTab = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const skillsData = await getAllSkillsWithCount();
      setSkills(skillsData);
    } catch (err: any) {
      console.error("Failed to fetch skills", err);
      setError("Impossible de charger les compétences");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;

    setIsAdding(true);
    try {
      await createSkill(newSkillName.trim());
      await fetchSkills(); // Refresh the list
      setNewSkillName("");
    } catch (err: any) {
      console.error("Failed to add skill", err);
      alert("Erreur lors de l'ajout de la compétence");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      return;
    }

    try {
      await deleteSkill(skillId);
      await fetchSkills(); // Refresh the list
    } catch (err: any) {
      console.error("Failed to delete skill", err);
      alert("Erreur lors de la suppression de la compétence");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestion des compétences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                {skills.length}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Compétences disponibles
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold dm-sans-bold text-orange-600">
                {skills.reduce((sum, skill) => sum + (skill.userCount || 0), 0)}
              </div>
              <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                Compétences déclarées
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Skill */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter une compétence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nom de la compétence..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              className="flex h-10 flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            />
            <button
              onClick={handleAddSkill}
              disabled={isAdding || !newSkillName.trim()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-neutral-900 text-white hover:bg-neutral-900/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isAdding ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Skills List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des compétences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {skills.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 mx-auto mb-3 text-neutral-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
                <p className="font-medium">Aucune compétence disponible</p>
              </div>
            ) : (
              skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors border border-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {skill.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {skill.userCount || 0} utilisateur(s)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="h-9 w-9 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-neutral-400 group-hover:text-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSkillsTab;
