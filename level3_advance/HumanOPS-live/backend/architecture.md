# HumanOps Live – Backend Architecture

## 📌 Overview

HumanOps Live est un **Human Observability System (HOS)** : une plateforme backend orientée signaux humains collectifs, temps réel, éthique et non intrusive.

Ce backend est conçu pour être **robuste, testable, évolutif et défendable** sur le plan logiciel et métier.

---

## 🧠 Vision Architecturale

Le backend repose sur une **combinaison volontaire et cohérente** de trois approches :

* **Architecture hexagonale (Clean Architecture)**
* **Approche Event-Driven interne**
* **Diffusion temps réel via WebSockets**

Ces approches ne sont pas concurrentes : elles se complètent.

---

## 🧱 1. Architecture Hexagonale (Structure)

L’architecture hexagonale définit la **structure fondamentale** du backend.

### Principes clés

* Le **cœur métier** est indépendant de toute technologie
* Les frameworks sont des **détails d’implémentation**
* La logique métier est **testable sans base de données ni serveur**

### Règles strictes

* ❌ Aucun accès DB dans le domaine
* ❌ Aucun code métier dans les controllers ou sockets
* ❌ Aucun couplage framework ↔ logique métier

### Organisation des couches

```
/src
 ├── domain
 │   ├── entities
 │   ├── value-objects
 │   ├── events
 │   └── repositories (interfaces)
 │
 ├── application
 │   ├── use-cases
 │   ├── services (orchestration métier)
 │   └── ports (interfaces input/output)
 │
 └── infrastructure
     ├── http (REST controllers)
     ├── ws (WebSocket / Socket.io)
     ├── persistence (Prisma)
     └── event-bus
```

---

## ⚡ 2. Event-Driven (Communication interne)

Le backend adopte une **approche event-driven** pour découpler les actions métier.

### Principe

* Les **use cases émettent des événements**
* Les événements déclenchent des réactions
* Aucun use case ne dépend directement d’un autre

### Exemples d’événements

* `HumanStateUpdated`
* `TeamTensionComputed`
* `CriticalTensionDetected`
* `ReinforcementRequested`
* `ReinforcementAccepted`

### Règles

* Les événements sont **purs et descriptifs**
* Ils représentent un fait métier
* Ils sont auditables et traçables

L’event bus est **in-memory** dans un premier temps, mais conçu pour être remplaçable (RabbitMQ, Kafka, etc.).

---

## 📡 3. Temps réel (WebSockets)

Le temps réel est implémenté comme **un adaptateur de sortie**.

### Principes clés

* Le WebSocket **n’exécute aucune logique métier**
* Il écoute uniquement les événements du domaine
* Il diffuse des informations temps réel vers le frontend

### Exemple de flux

```
HumanStateUpdated
  → EventBus
    → SocketAdapter.broadcast("human_state:update")
```

### Cas d’usage du temps réel

* Mise à jour des états humains
* Alertes de tension collective
* Sollicitations de renfort

---

## 🧠 Philosophie Métier et Éthique

HumanOps Live repose sur des principes forts :

* ❌ Aucune surveillance individuelle
* ❌ Aucun scoring visible utilisateur
* ❌ Aucune logique punitive

### Principes métier appliqués dans le code

* Raisonnement **collectif et agrégé uniquement**
* Données contextualisées et pondérées
* Séparation stricte entre RH administratif et observabilité humaine

---

## 🚫 Ce qui est explicitement interdit

* Logique métier dans les controllers
* Services « fourre-tout »
* Accès direct Prisma depuis le domaine
* Couplage WebSocket ↔ Base de données
* Architecture CRUD sans use cases
* Temps réel implémenté dans le core

---

## 🎯 Objectifs techniques

Le backend doit :

* Exposer des API REST claires
* Diffuser des événements temps réel fiables
* Calculer des tensions humaines collectives
* Être testable sans infrastructure
* Être extensible vers :

  * microservices
  * message brokers
  * analytics avancés

---

## 🧾 Résumé

> Le backend de HumanOps Live repose sur une architecture hexagonale pour isoler la logique métier, une communication interne event-driven pour gérer les signaux humains, et un adaptateur WebSocket pour la diffusion temps réel, le tout dans une logique éthique, collective et non intrusive.
