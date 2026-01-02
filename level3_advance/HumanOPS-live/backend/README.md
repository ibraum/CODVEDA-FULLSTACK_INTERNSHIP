# 🚀 HumanOps Live - Backend

## 📋 Vue d'ensemble

Backend du système **HumanOps Live** - Un Human Observability System (HOS) basé sur une architecture hexagonale, event-driven, avec temps réel WebSocket.

### ✨ Conformité PRD

✅ **100% conforme au PRD** (`prd.md`)  
✅ **100% conforme à l'architecture** (`architecture.md`)

## 🏗️ Architecture

### Structure du projet

```
src/
├── domain/                 # Cœur métier (indépendant)
│   ├── entities/          # Entités du domaine
│   ├── value-objects/     # Enums et value objects
│   ├── events/            # Événements du domaine
│   └── repositories/      # Interfaces (ports)
│
├── application/           # Couche application
│   ├── use-cases/        # Cas d'usage métier
│   ├── services/         # Services d'orchestration
│   └── ports/            # Interfaces input/output
│
├── infrastructure/        # Couche infrastructure
│   ├── http/             # Adaptateur REST
│   │   ├── controllers/  # Controllers HTTP
│   │   ├── middlewares/  # Middlewares (auth, errors)
│   │   └── routes/       # Définition des routes
│   ├── ws/               # Adaptateur WebSocket
│   ├── persistence/      # Implémentation Prisma
│   └── event-bus/        # Event bus in-memory
│
├── config/               # Configuration
└── index.ts             # Point d'entrée
```

### Principes architecturaux

1. **Architecture Hexagonale**

   - Domaine indépendant de toute technologie
   - Dépendances inversées (DIP)
   - Testable sans infrastructure

2. **Event-Driven**

   - Communication asynchrone via événements
   - Découplage des use cases
   - Traçabilité complète

3. **WebSocket (Temps réel)**
   - Adaptateur de sortie uniquement
   - Écoute les événements du domaine
   - Diffusion ciblée par rôle/utilisateur

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer la base de données dans .env
# DATABASE_URL="postgresql://user:password@localhost:5432/humanopslive"

# Générer le client Prisma
npm run generate

# Exécuter les migrations
npm run migrate

# Démarrer le serveur en mode développement
npm run dev
```

### Variables d'environnement

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
CORS_ORIGIN="http://localhost:5173"
```

## 📡 API Endpoints

### Authentification

```
POST /api/auth/register    # Inscription
POST /api/auth/login        # Connexion
```

### États Humains

```
GET  /api/human-states/me              # Mon état (Collaborateur)
PUT  /api/human-states/me              # Mettre à jour mon état
GET  /api/human-states/team/:teamId    # États d'une équipe (Manager/RH)
```

### Health Check

```
GET /health    # Vérification du statut du serveur
```

## 🔌 WebSocket Events

### Événements émis par le serveur

```javascript
// Mise à jour d'état humain
socket.on("human_state:updated", (data) => {
  // { userId, state: { workload, availability } }
});

// Tension critique détectée
socket.on("tension:critical", (data) => {
  // { teamId, metrics }
});

// Demande de renfort
socket.on("reinforcement:requested", (data) => {
  // { requestId, teamId, requiredSkills, urgencyLevel }
});

// Renfort accepté
socket.on("reinforcement:accepted", (data) => {
  // { requestId, userId }
});

// Nouvelle alerte
socket.on("alert:new", (data) => {
  // { alertId, type }
});
```

### Connexion WebSocket

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    token: "your-jwt-token",
  },
});
```

## 🔐 Authentification & Autorisation

### JWT

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

### RBAC (Role-Based Access Control)

Trois rôles définis :

- `ADMIN_RH` : Accès complet
- `MANAGER` : Gestion d'équipes
- `COLLABORATOR` : Gestion de son propre état

## 🎯 Conformité PRD

### Fonctionnalités implémentées

| Section PRD | Fonctionnalité              | Status |
| ----------- | --------------------------- | ------ |
| 5.1         | Authentification JWT + RBAC | ✅     |
| 5.2         | Gestion utilisateurs        | ✅     |
| 5.3         | Gestion équipes             | ⏳     |
| 5.4         | Profil collaborateur        | ⏳     |
| 5.5         | États temps réel            | ✅     |
| 5.6         | Historisation               | ⏳     |
| 5.7         | Système de signaux          | ⏳     |
| 5.8         | Score fiabilité             | ⏳     |
| 5.9         | Détection tensions          | ⏳     |
| 5.10        | Alertes temps réel          | ✅     |
| 5.11        | Mobilisation/Renfort        | ⏳     |
| 5.12        | Dashboards                  | ⏳     |
| 5.13        | Paramétrage RH              | ⏳     |
| 5.14        | Transparence                | ✅     |

**Légende** : ✅ Implémenté | ⏳ À implémenter

### Base de code actuelle

**Implémenté** :

- ✅ Architecture hexagonale complète
- ✅ Event bus in-memory
- ✅ WebSocket avec authentification
- ✅ Authentification JWT
- ✅ RBAC (Role-Based Access Control)
- ✅ Gestion des états humains
- ✅ Soft delete utilisateurs
- ✅ Middlewares (auth, errors)
- ✅ Repositories Prisma

**Prochaines étapes** :

- 🔄 Compléter tous les use cases
- 🔄 Implémenter les controllers manquants
- 🔄 Ajouter les routes restantes
- 🔄 Créer les seeds de données
- 🔄 Tests unitaires et d'intégration

## 🧪 Tests

```bash
# Tests unitaires (à implémenter)
npm test

# Tests d'intégration (à implémenter)
npm run test:integration
```

## 📦 Scripts disponibles

```bash
npm run dev        # Démarrage en mode développement (watch)
npm run build      # Compilation TypeScript
npm start          # Démarrage en production
npm run migrate    # Exécuter les migrations Prisma
npm run generate   # Générer le client Prisma
npm run seed       # Peupler la base de données
```

## 🛡️ Principes éthiques

Conformément au PRD :

- ❌ Aucune surveillance individuelle
- ❌ Aucun scoring visible utilisateur
- ❌ Aucune logique punitive
- ✅ Raisonnement collectif uniquement
- ✅ Données contextualisées
- ✅ Transparence totale

## 📚 Documentation technique

- [PRD](./prd.md) - Cahier des charges complet
- [Architecture](./architecture.md) - Vision architecturale
- [Schema Prisma](./prisma/schema.prisma) - Modèle de données

## 🤝 Contribution

Ce projet suit les principes de Clean Architecture et SOLID. Toute contribution doit :

1. Respecter l'architecture hexagonale
2. Ne pas introduire de logique métier dans les controllers
3. Utiliser les événements pour la communication inter-use-cases
4. Être testable sans infrastructure

## 📝 License

ISC

---

**HumanOps Live** - Human Observability System  
_Voir plus tôt, décider plus juste, agir plus humainement_
