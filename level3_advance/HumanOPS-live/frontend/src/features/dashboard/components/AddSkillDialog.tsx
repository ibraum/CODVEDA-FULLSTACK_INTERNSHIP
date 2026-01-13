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
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-background text-foreground rounded-3xl p-0 overflow-hidden flex flex-col border border-border">
        {/* Banner */}
        <div className="bg-muted px-8 py-6 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold dm-sans-bold mb-2 text-foreground">
              Ajouter des compétences
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
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
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddSkillToList}
                  disabled={!searchTerm.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
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
                <div className="bg-muted/50 border border-border rounded-xl p-3 max-h-[150px] overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
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
                        className="px-3 py-1 text-sm bg-background border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer text-foreground"
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
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
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
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
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
                  <p className="text-muted-foreground text-sm">
                    Aucune compétence sélectionnée
                  </p>
                  <p className="text-muted-foreground/70 text-xs mt-1">
                    Tapez et appuyez sur Entrée ou cliquez sur +
                  </p>
                </div>
              ) : (
                <div className="bg-muted/30 border border-border rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="h-5 w-5 rounded-full bg-primary-foreground/20 hover:bg-red-500 flex items-center justify-center transition-all"
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
          <div className="p-6 border-t border-border bg-muted/40 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedSkills.length === 0}
              className="px-8 py-3 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10 min-w-[140px]"
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
