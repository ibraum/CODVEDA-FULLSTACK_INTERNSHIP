import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "../../../components/common/StatsCard";
import { UserCard } from "../../../components/common/UserCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getAllUsersWithStates,
  updateUser,
  deleteUser,
  type UserWithHumanState,
} from "../../rh/services/rhService";

const ManageUsersTab = () => {
  const [users, setUsers] = useState<UserWithHumanState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithHumanState | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "COLLABORATOR",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getAllUsersWithStates();
      setUsers(usersData);
    } catch (err: any) {
      console.error("Failed to fetch users", err);
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserWithHumanState) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      await updateUser(selectedUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      });
      await fetchUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Failed to update user", err);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      await deleteUser(selectedUser.id);
      await fetchUsers();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Failed to delete user", err);
      alert("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (user: UserWithHumanState) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const hasUsers = users.length > 0;

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
                <Skeleton key={i} className="h-16" />
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

  // Calculate statistics
  const totalUsers = users.length;
  const availableUsers = users.filter(
    (u) => u.humanState?.availability === "AVAILABLE"
  ).length;
  const overloadedUsers = users.filter(
    (u) => u.humanState?.workload === "HIGH"
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Gestion des utilisateurs</CardTitle>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Ajouter un utilisateur
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              title="Utilisateurs"
              value={totalUsers}
              variant="default"
              color="neutral"
            />
            <StatsCard
              title="Disponibles"
              value={availableUsers}
              variant="default"
              color="green"
            />
            <StatsCard
              title="Surchargés"
              value={overloadedUsers}
              variant="default"
              color="red"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold dm-sans-bold text-neutral-900">
          Liste des utilisateurs
        </h3>
        {!hasUsers ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-neutral-300 text-center flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-neutral-500 text-sm mt-1">
              Commencez par ajouter votre premier utilisateur
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                actions={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                      className="flex-1 bg-neutral-900 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(user);
                      }}
                      className="bg-red-50 text-red-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl dm-sans-bold">
              Modifier l'utilisateur
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Email (non modifiable)
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <option value="COLLABORATOR">Collaborateur</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN_RH">Admin RH</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveUser}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action désactivera l'utilisateur{" "}
              <span className="font-semibold text-neutral-900">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              . L'utilisateur ne pourra plus se connecter mais ses données
              seront conservées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSaving ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog - Placeholder for future implementation */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl dm-sans-bold">
              Ajouter un utilisateur
            </DialogTitle>
            <DialogDescription>
              Cette fonctionnalité sera disponible prochainement.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 text-neutral-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            </div>
            <p className="text-neutral-600">
              L'ajout d'utilisateurs nécessite l'endpoint d'inscription côté
              backend.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsersTab;
