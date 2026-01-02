# 📘 Cahier des Charges : HumanOps Live

## Type de Système

**Human Observability System (HOS)**  
_Plateforme d'observabilité humaine opérationnelle en temps réel_

HumanOps Live applique les principes d'observabilité des systèmes distribués (signaux, corrélation, seuils, alertes) à la capacité humaine collective, **sans surveillance individuelle ni logique d'évaluation**.

---

## 1. Contexte et Problématique

Les organisations utilisent des **SIRH** pour gérer l'administratif RH : contrats, congés, paie, conformité.

### Limites actuelles

Ces outils ne permettent pas de répondre à des questions opérationnelles immédiates :

- ❓ **Qui est réellement mobilisable maintenant ?**
- ⚠️ **Quelle équipe est en surcharge avant la rupture ?**
- 🔍 **Où se situent les tensions humaines en temps réel ?**

### Conséquences

Les décisions sont souvent basées sur :

- Des **ressentis** subjectifs
- Des **données obsolètes**
- Des **tables Excel statiques**

### Solution

**HumanOps Live** comble ce vide en fournissant une **observabilité humaine continue, collective et éthique**.

---

## 2. Objectifs du Produit

### 🎯 Objectif Principal

> Rendre visibles les déséquilibres humains opérationnels en temps réel afin d'aider les équipes RH et les managers à prendre des décisions rapides, humaines et informées.

### 📊 Objectifs Secondaires

- ⏰ Anticiper les surcharges humaines
- 🎲 Réduire les décisions subjectives
- 🔄 Fluidifier la mobilisation des compétences
- 🛡️ Préserver la confiance et l'éthique
- ⚡ Améliorer la réactivité organisationnelle

---

## 3. Principes Métier Fondamentaux

| Principe                   | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| 🔄 **Aucun signal absolu** | Aucun signal humain n'est absolu                      |
| 🔗 **Corrélation**         | Les décisions reposent sur la corrélation de signaux  |
| 👥 **Priorité collective** | La priorité est donnée au collectif                   |
| ⚖️ **Neutralité totale**   | Aucun usage disciplinaire                             |
| ⚡ **Temps réel**          | Le temps réel est un socle fonctionnel, pas un gadget |

---

## 4. Rôles Utilisateurs

| Rôle                     | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| 👨‍💼 **Administrateur RH** | Paramétrage des règles métier et vision globale      |
| 👔 **Manager**           | Pilotage de la capacité opérationnelle de son équipe |
| 👤 **Collaborateur**     | Déclaration d'état et réponse aux sollicitations     |

---

## 5. Fonctionnalités Détaillées

> **Structure** : Description – Attributs – Règles métier – Contraintes

### 5.1 🔐 Authentification et Sécurité

**Description**  
Gestion sécurisée des accès à la plateforme.

**Attributs**

- Inscription / connexion
- JWT (JSON Web Tokens)
- RBAC (Role-Based Access Control)
- Sessions sécurisées

**Règles métier**

- Un utilisateur possède un seul rôle principal
- Les droits sont définis par le rôle, jamais par l'individu

**Contraintes**

- ✅ Hashage des mots de passe
- ⏱️ Expiration des tokens
- 🔒 Protection des routes backend et frontend

---

### 5.2 👥 Gestion des Utilisateurs

**Description**  
Création et gestion des comptes sans données RH administratives.

**Attributs**

- Identité minimale
- Rôle
- Statut actif/inactif

**Règles métier**

- ❌ Aucune donnée contractuelle ou salariale
- 🚫 Un utilisateur inactif ne génère plus de signaux

**Contraintes**

- 📧 Email unique
- 🗑️ Suppression logique

---

### 5.3 🏢 Gestion des Équipes

**Description**  
Structuration de l'organisation en unités observables.

**Attributs**

- Nom de l'équipe
- Manager référent
- Membres

**Règles métier**

- Un collaborateur appartient à **une seule équipe principale**
- Un manager peut gérer **plusieurs équipes**

**Contraintes**

- ⛔ Suppression impossible si membres actifs

---

### 5.4 📋 Profil Collaborateur Opérationnel

**Description**  
Profil volontairement réduit à l'opérationnel.

**Attributs**

- Identité minimale
- Compétences actives
- Préférences de mobilisation

**Règles métier**

- Données déclaratives
- Modifiables à tout moment

**Contraintes**

- ❌ Aucune donnée RH classique autorisée

---

### 5.5 📡 États Humains en Temps Réel (Signal Primaire)

**Description**  
Déclaration volontaire de l'état opérationnel réel.

**Attributs**

- **Charge** : faible / normale / élevée
- **Disponibilité** : disponible / mobilisable / indisponible
- Horodatage

**Règles métier**

- ✏️ Toujours modifiable
- 🚫 Jamais interprété seul

**Contraintes**

- ⚡ Propagation temps réel (WebSockets)
- ❌ Aucune justification obligatoire

---

### 5.6 📜 Historisation des États Humains

**Description**  
Conservation de l'évolution des états pour analyse.

**Attributs**

- Ancien état
- Nouvel état
- Timestamp

**Règles métier**

- Utilisation uniquement **agrégée**

**Contraintes**

- 🔒 Accès restreint RH
- ❌ Aucune analyse individuelle directe

---

### 5.7 🎯 Système de Signaux Humains

**Description**  
Corrélation de plusieurs types de signaux.

**Attributs**

- **Déclaratifs** : charge, disponibilité
- **Comportementaux** : durée, fréquence, acceptation
- **Contextuels** : urgences, renforts, taille d'équipe

**Règles métier**

- ❌ Aucun signal ne déclenche seul une alerte
- ⚙️ Pondérations configurables

**Contraintes**

- 🖥️ Calcul backend uniquement

---

### 5.8 📊 Score de Fiabilité Interne

**Description**  
Mesure interne de cohérence des signaux.

**Attributs**

- Score entre **0.4** et **1.0**

**Règles métier**

- 🙈 Invisible pour tous les utilisateurs
- ❌ Jamais utilisé pour sanctionner

**Contraintes**

- 🤖 Calcul automatique

---

### 5.9 ⚠️ Détection des Tensions Humaines

**Description**  
Identification des déséquilibres collectifs.

**Attributs**

- Pourcentage de surcharge
- Durée moyenne
- Ratio demandes/disponibilités
- Taux de refus

**Règles métier**

- **Niveaux** : faible / modérée / élevée / critique
- Basés sur règles RH configurables

**Contraintes**

- 👥 Lecture strictement collective

---

### 5.10 🔔 Alertes et Notifications Temps Réel

**Description**  
Information ciblée et non intrusive.

**Attributs**

- Alertes RH
- Notifications managers
- Sollicitations collaborateurs

**Règles métier**

- 🚫 Pas de spam
- 🔴 Priorité aux situations critiques

**Contraintes**

- ⚡ Temps réel obligatoire

---

### 5.11 🚀 Mobilisation et Renfort

**Description**  
Réallocation rapide de la capacité humaine.

**Attributs**

- Demandes de renfort
- Compétences requises
- Urgence

**Règles métier**

- ✅ Acceptation volontaire
- ⏱️ Expiration automatique

**Contraintes**

- 📝 Traçabilité sans jugement

---

### 5.12 📊 Dashboards Opérationnels

**Description**  
Visualisation adaptée à chaque rôle.

**Attributs**

- **Collaborateur** : état, sollicitations
- **Manager** : capacité, tension équipe
- **RH** : carte globale, tendances

**Règles métier**

- 🔍 Chaque rôle voit uniquement son périmètre

**Contraintes**

- ❌ Aucun classement individuel

---

### 5.13 ⚙️ Paramétrage RH

**Description**  
Adaptation du système sans code.

**Attributs**

- Seuils
- Pondérations
- Alertes

**Règles métier**

- 📝 Modifications traçables

**Contraintes**

- 🔒 Accès réservé RH

---

### 5.14 🛡️ Transparence et Éthique

**Description**  
Condition essentielle à l'adoption.

**Attributs**

- Page explicative
- Engagements clairs

**Règles métier**

- 💎 Transparence totale sur ce qui est mesuré

**Contraintes**

- ❌ Aucune donnée cachée

---

## 6. Architecture Technique

| Composant               | Technologie       |
| ----------------------- | ----------------- |
| 🎨 **Frontend**         | React             |
| ⚙️ **Backend**          | Node.js + Express |
| ⚡ **Temps réel**       | Socket.io         |
| 🗄️ **Base de données**  | PostgreSQL        |
| 🔧 **ORM**              | Prisma            |
| 🔐 **Authentification** | JWT               |

---

## 7. Conformité Codveda – Level 3++

✅ Application full-stack complète  
✅ Authentification + rôles  
✅ Base de données relationnelle  
✅ WebSockets critiques  
✅ Logique métier avancée  
✅ Projet innovant et défendable

---

## 8. Conclusion

### HumanOps Live n'est :

- ❌ **Ni un SIRH**
- ❌ **Ni un outil de surveillance**

### C'est un Human Observability System, conçu pour aider les organisations à :

- 👁️ **Voir plus tôt**
- ⚖️ **Décider plus juste**
- ❤️ **Agir plus humainement**

---

**👉 Un projet Level 3++, orienté produit, métier et architecture.**
