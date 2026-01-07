import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { getAllSkills, addSkill } from "../../auth/services/authService";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddSkillDialog = ({ open, onOpenChange }: AddSkillDialogProps) => {
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      getAllSkills()
        .then(setSkills)
        .catch((err) => console.error("Failed to fetch skills", err));
    }
  }, [open]);

  const handleAddSkillToList = () => {
    if (!searchTerm.trim()) return;

    // Check if skill already in selected list
    if (!selectedSkills.includes(searchTerm.trim())) {
      setSelectedSkills([...selectedSkills, searchTerm.trim()]);
      setSearchTerm("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;

    setIsSubmitting(true);
    try {
      // Add all selected skills
      await Promise.all(selectedSkills.map((skillName) => addSkill(skillName)));
      onOpenChange(false);
      setSelectedSkills([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Failed to add skills", error);
      alert("Erreur lors de l'ajout des compétences. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkillToList();
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-white text-neutral-900 rounded-3xl p-0 overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 px-8 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold dm-sans-bold mb-2">
              Ajouter des compétences
            </DialogTitle>
            <DialogDescription className="text-neutral-200 text-base">
              Recherchez et ajoutez plusieurs compétences à votre profil
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="p-8 space-y-6 flex-1 overflow-y-auto">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: React, Gestion de projet, Python..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddSkillToList}
                  disabled={!searchTerm.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>

              {/* Suggestions */}
              {searchTerm && filteredSkills.length > 0 && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 max-h-[150px] overflow-y-auto">
                  <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => {
                          setSearchTerm(skill.name);
                          handleAddSkillToList();
                        }}
                        className="px-3 py-1 text-sm bg-white border border-neutral-300 rounded-full hover:bg-neutral-900 hover:text-white transition-all"
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Compétences sélectionnées ({selectedSkills.length})
                </h3>
                {selectedSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSkills([])}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {selectedSkills.length === 0 ? (
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-neutral-300 mb-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                    />
                  </svg>
                  <p className="text-neutral-400 text-sm">
                    Aucune compétence sélectionnée
                  </p>
                  <p className="text-neutral-300 text-xs mt-1">
                    Tapez et appuyez sur Entrée ou cliquez sur +
                  </p>
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="h-5 w-5 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-3 h-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 text-sm font-medium text-neutral-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedSkills.length === 0}
              className="px-8 py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10 min-w-[140px]"
            >
              {isSubmitting ? "Ajout..." : `Ajouter (${selectedSkills.length})`}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog;
