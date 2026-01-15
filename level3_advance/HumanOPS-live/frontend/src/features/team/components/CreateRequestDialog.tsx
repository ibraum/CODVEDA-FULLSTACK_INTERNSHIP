import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    createReinforcementRequest,
    updateReinforcementRequest,
    getTeams,
    type ReinforcementRequest,
    type Team
} from "../services/teamService";
import { useAuth } from "../../auth/context/AuthContext";
import { cn } from "@/lib/utils";

interface CreateRequestDialogProps {
    children?: React.ReactNode;
    onSuccess?: () => void;
    requestToEdit?: ReinforcementRequest;
}

const CreateRequestDialog = ({ children, onSuccess, requestToEdit }: CreateRequestDialogProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Admin specific state
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");

    const [formData, setFormData] = useState({
        urgencyLevel: "5",
        durationHours: "24",
        skills: "",
    });

    const isEditing = !!requestToEdit;

    useEffect(() => {
        if (open) {
            if (requestToEdit) {
                setFormData({
                    urgencyLevel: requestToEdit.urgencyLevel.toString(),
                    durationHours: "24", // Default as not stored in entity
                    skills: Object.keys(requestToEdit.requiredSkills).join(", "),
                });
                if (requestToEdit.teamId) {
                    setSelectedTeamId(requestToEdit.teamId);
                }
            } else {
                // Reset form
                setFormData({
                    urgencyLevel: "5",
                    durationHours: "24",
                    skills: "",
                });
                if (user?.teamId) {
                    setSelectedTeamId(user.teamId);
                }
            }

            if (user?.role === "ADMIN_RH") {
                getTeams().then(setTeams).catch(console.error);
            }
        }
    }, [open, requestToEdit, user]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // For admins, a team must be selected. For managers, user.teamId is used implicitely if not passed,
        // but better to rely on selectedTeamId initialized from user.teamId
        const teamIdToUse = selectedTeamId || user?.teamId;

        if (!teamIdToUse) {
            console.warn("Please select a team.");
            return;
        }

        try {
            setLoading(true);

            const skillsMap: Record<string, boolean> = {};
            if (formData.skills) {
                formData.skills.split(",").forEach(skill => {
                    const s = skill.trim();
                    if (s) skillsMap[s] = true;
                });
            }

            if (isEditing && requestToEdit) {
                await updateReinforcementRequest(requestToEdit.id, {
                    urgencyLevel: parseInt(formData.urgencyLevel),
                    requiredSkills: skillsMap,
                });
            } else {
                await createReinforcementRequest({
                    teamId: teamIdToUse,
                    urgencyLevel: parseInt(formData.urgencyLevel),
                    durationHours: parseInt(formData.durationHours),
                    requiredSkills: skillsMap,
                });
            }

            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to save request", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-border shadow-xl bg-background">
                <DialogHeader>
                    <DialogTitle className="text-xl dm-sans-bold text-foreground">
                        {isEditing ? "Edit Request" : "New Reinforcement Request"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isEditing ? "Update request details." : "Create a request to signal a need for additional resources."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-4">

                        {/* Admin Team Selection */}
                        {user?.role === "ADMIN_RH" && !isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="team" className="text-foreground">Affected Team</Label>
                                <Select
                                    value={selectedTeamId}
                                    onValueChange={setSelectedTeamId}
                                >
                                    <SelectTrigger id="team" className="w-full bg-background border-input">
                                        <SelectValue placeholder="Select a team" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {teams.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="urgency" className="text-foreground">Urgency Level (1-10)</Label>
                            <div className="flex items-center gap-4">
                                <Select
                                    value={formData.urgencyLevel}
                                    onValueChange={(val) => setFormData({ ...formData, urgencyLevel: val })}
                                >
                                    <SelectTrigger id="urgency" className={cn("w-full transition-all",
                                        parseInt(formData.urgencyLevel) > 7 ? "border-red-200 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 focus:ring-red-200" :
                                            parseInt(formData.urgencyLevel) > 4 ? "border-orange-200 bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-200 focus:ring-orange-200" :
                                                "border-input bg-background"
                                    )}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[...Array(10)].map((_, i) => (
                                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                {i + 1} - {(i + 1) <= 3 ? "Low" : (i + 1) <= 7 ? "Medium" : "Critical"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {!isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-foreground">Estimated Duration (hours)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    value={formData.durationHours}
                                    onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                                    className="font-medium bg-background border-input"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-foreground">Required Skills</Label>
                            <Input
                                id="skills"
                                placeholder="React, Node.js, Design..."
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="bg-background border-input"
                            />
                            <p className="text-xs text-muted-foreground">
                                Separate skills with commas.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : isEditing ? "Update" : "Create Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRequestDialog;
