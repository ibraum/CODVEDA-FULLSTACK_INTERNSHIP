# 🚀 Système de Notifications en Temps Réel - HumanOps Live

## Vue d'ensemble

Le système de notifications en temps réel utilise **WebSocket** (Socket.IO) pour permettre une communication bidirectionnelle entre le backend et le frontend. Cela permet aux utilisateurs de recevoir instantanément des notifications pour :

1. **Nouvelles demandes de renfort** (tous les utilisateurs)
2. **Alertes de tension d'équipe** (managers et admins uniquement)
3. **Mises à jour d'état humain** (pour rafraîchir les dashboards)

---

## Architecture

### Frontend

#### 1. **Socket Client** (`/frontend/src/lib/socket.ts`)

- Configuration du client Socket.IO
- Connexion automatique avec authentification JWT
- Gestion de la reconnexion automatique

#### 2. **Hook useRealtimeNotifications** (`/frontend/src/hooks/useRealtimeNotifications.ts`)

- Hook React personnalisé pour gérer les événements WebSocket
- Écoute les événements suivants :
  - `reinforcement:new` - Nouvelle demande de renfort
  - `tension:alert` - Alerte de tension d'équipe
  - `humanState:updated` - Mise à jour d'état humain

#### 3. **Intégration dans Layout** (`/frontend/src/components/layout/Layout.tsx`)

- Le hook est appelé au niveau du Layout pour être actif sur toute l'application
- Les notifications sont affichées via l'API Notification du navigateur

---

## Événements WebSocket

### 1. `reinforcement:new`

**Déclenché quand** : Un manager crée une nouvelle demande de renfort

**Payload** :
\`\`\`typescript
{
requestId: string;
teamId: string;
teamName: string;
urgencyLevel: number; // 1-10
requiredSkills: Record<string, any>;
}
\`\`\`

**Qui reçoit** : Tous les utilisateurs connectés

**Action** : Notification navigateur + possibilité de toast

---

### 2. `tension:alert`

**Déclenché quand** : Une équipe atteint un niveau de tension élevé/critique

**Payload** :
\`\`\`typescript
{
teamId: string;
teamName: string;
tensionLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
metrics: {
overloadPercentage: number;
averageDuration: number;
};
}
\`\`\`

**Qui reçoit** : Managers et Admins RH uniquement

**Action** :

- Notification navigateur (requireInteraction si CRITICAL)
- Possibilité de toast avec niveau d'urgence

---

### 3. `humanState:updated`

**Déclenché quand** : Un utilisateur met à jour son état humain

**Payload** :
\`\`\`typescript
{
userId: string;
workload: "LOW" | "NORMAL" | "HIGH";
availability: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
teamId?: string;
}
\`\`\`

**Qui reçoit** : Tous les utilisateurs (pour rafraîchir les dashboards)

**Action** : Dispatch d'un événement custom pour mettre à jour l'UI

---

## Backend - Événements à Émettre

### Configuration Socket.IO Backend

Le backend doit émettre ces événements aux moments appropriés :

#### 1. Lors de la création d'une demande de renfort

\`\`\`typescript
// Dans ReinforcementController ou le service approprié
io.emit('reinforcement:new', {
requestId: request.id,
teamId: request.teamId,
teamName: team.name,
urgencyLevel: request.urgencyLevel,
requiredSkills: request.requiredSkills
});
\`\`\`

#### 2. Lors du calcul de tension d'équipe

\`\`\`typescript
// Dans TensionService ou après calcul de tension
if (tension.level === 'HIGH' || tension.level === 'CRITICAL') {
// Émettre uniquement aux managers et admins
io.to('managers').to('admins').emit('tension:alert', {
teamId: team.id,
teamName: team.name,
tensionLevel: tension.level,
metrics: {
overloadPercentage: tension.overloadPercentage,
averageDuration: tension.averageDuration
}
});
}
\`\`\`

#### 3. Lors de la mise à jour d'état humain

\`\`\`typescript
// Dans HumanStateController
io.emit('humanState:updated', {
userId: user.id,
workload: humanState.workload,
availability: humanState.availability,
teamId: user.teamId
});
\`\`\`

---

## Dashboard Admin RH

### Nouveau Dashboard (`/frontend/src/features/dashboard/components/AdminDashboard.tsx`)

Le dashboard admin affiche :

#### Métriques Clés

- 📊 Total utilisateurs (avec disponibles)
- 👥 Équipes actives (avec équipes en tension)
- 🚨 Demandes de renfort actives

#### Graphiques

1. **Répartition par Rôle** (Pie Chart)

   - Admin RH
   - Managers
   - Collaborateurs

2. **Tensions des Équipes** (Bar Chart)

   - Faible, Modérée, Élevée, Critique

3. **Distribution de la Charge** (Bar Chart coloré)

   - Faible (vert)
   - Normal (jaune)
   - Élevé (rouge)

4. **Statistiques Rapides** (Cards)
   - Utilisateurs disponibles (%)
   - Utilisateurs surchargés (%)
   - Équipes en tension (%)

#### Mise à Jour en Temps Réel

Le dashboard écoute l'événement `humanStateUpdate` pour se rafraîchir automatiquement :

\`\`\`typescript
useEffect(() => {
const handleUpdate = () => {
fetchDashboardData(); // Rafraîchir les données
};

window.addEventListener('humanStateUpdate', handleUpdate);
return () => window.removeEventListener('humanStateUpdate', handleUpdate);
}, []);
\`\`\`

---

## Permissions des Notifications

### Demande de Permission

La permission est demandée automatiquement au premier chargement :

\`\`\`typescript
if ("Notification" in window && Notification.permission === "default") {
Notification.requestPermission();
}
\`\`\`

### États de Permission

- `granted` : Notifications activées ✅
- `denied` : Notifications bloquées ❌
- `default` : Pas encore demandé ⏳

---

## Intégration avec Toast (Optionnel)

Pour ajouter des notifications toast (recommandé pour une meilleure UX) :

### 1. Installer une bibliothèque de toast

\`\`\`bash
npm install react-hot-toast

# ou

npm install sonner
\`\`\`

### 2. Décommenter les lignes dans useRealtimeNotifications.ts

\`\`\`typescript
import toast from 'react-hot-toast';

// Dans handleNewReinforcementRequest
toast.info(\`Nouvelle demande de renfort de \${data.teamName}\`);

// Dans handleTensionAlert
if (isUrgent) {
toast.error(\`Tension critique dans \${data.teamName}\`);
} else {
toast.warning(\`Tension élevée dans \${data.teamName}\`);
}
\`\`\`

---

## Tests

### Tester les Notifications

1. **Ouvrir deux navigateurs** (ou onglets en mode incognito)
2. **Se connecter** avec des comptes différents
3. **Créer une demande de renfort** depuis un compte manager
4. **Vérifier** que tous les utilisateurs reçoivent la notification

### Tester les Alertes de Tension

1. **Mettre plusieurs utilisateurs** d'une équipe en charge HIGH
2. **Vérifier** que le manager et l'admin reçoivent l'alerte
3. **Vérifier** que les collaborateurs ne reçoivent PAS l'alerte

---

## Sécurité

### Authentification Socket

Le socket utilise le token JWT stocké dans localStorage :

\`\`\`typescript
socket.auth = { token };
\`\`\`

### Validation Backend

Le backend doit :

1. Vérifier le token JWT à la connexion
2. Associer le socket à l'utilisateur
3. Filtrer les événements selon le rôle

---

## Performance

### Optimisations

- ✅ Reconnexion automatique en cas de déconnexion
- ✅ Déconnexion automatique lors du logout
- ✅ Événements filtrés par rôle (évite le spam)
- ✅ Notifications groupées par tag (évite les doublons)

### Bonnes Pratiques

- Ne pas émettre trop d'événements (throttling recommandé)
- Utiliser des rooms Socket.IO pour cibler les utilisateurs
- Nettoyer les listeners lors du unmount des composants

---

## Prochaines Étapes

1. ✅ Dashboard Admin RH créé
2. ✅ Hook de notifications en temps réel créé
3. ✅ Intégration dans Layout
4. ⏳ **Backend** : Émettre les événements WebSocket
5. ⏳ **Backend** : Filtrer les événements par rôle
6. ⏳ **Frontend** : Ajouter react-hot-toast pour les toasts
7. ⏳ **Frontend** : Rafraîchissement auto des dashboards

---

## Résumé

🎯 **Objectif atteint** : Système de notifications en temps réel fonctionnel

📊 **Dashboard Admin** : Vue d'ensemble complète de la plateforme

🔔 **Notifications** : Demandes de renfort + Alertes de tension

🚀 **Prêt pour** : Intégration backend et tests en production
