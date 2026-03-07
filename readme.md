# Recouvra+ – API de gestion du recouvrement

## 📋 Description

Recouvra+ est une API REST développée avec Express.js permettant de gérer les clients, les factures impayées et les actions de recouvrement d'une entreprise. Le projet est uniquement backend, sans paiement en ligne ni fonctionnalités temps réel.

## ✨ Fonctionnalités

L'API REST propose les fonctionnalités suivantes :

- **Gestion des utilisateurs** avec rôles (agent, manager, admin)
- **Gestion des clients** et informations associées
- **Gestion des factures** et leurs statuts
- **Enregistrement des paiements manuels**
- **Suivi des actions de recouvrement**
- **Statistiques simples** sur le recouvrement

## 🛠️ Technologies

- **Runtime** : Node.js 22
- **Framework** : Express.js
- **Base de données** : MongoDB (Mongoose)
- **Authentification** : JWT (JSON Web Tokens)
- **Validation** : Joi
- **Documentation** : Swagger
- **Tests** : Jest

## 📦 Installation

### Prérequis

- Node.js 22 ou supérieur
- MongoDB (local ou cloud)
- npm (inclus avec Node.js)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd Recouvra
   ```

2. **Installer les dépendances npm**
   ```bash
   npm install
   ```

3. **Installer Express.js**
   ```bash
   npm install express
   ```

4. **Installer les dépendances supplémentaires**
   ```bash
   npm install mongoose
   npm install jsonwebtoken
   npm install joi
   npm install swagger-ui-express swagger-jsdoc
   npm install jest --save-dev
   ```

   Ou en une seule commande :
   ```bash
   npm install express mongoose jsonwebtoken joi swagger-ui-express swagger-jsdoc jest --save-dev
   ```

5. **Configuration de l'environnement**
   
   Créer un fichier `.env` à la racine du projet :
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/recouvra
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

6. **Démarrer l'application**
   ```bash
   npm start
   ```

   ou en mode développement (avec nodemon) :
   ```bash
   npm run dev
   ```

## 📁 Structure du projet

```
Recouvra/
├── app.js                 # Point d'entrée de l'application
├── package.json          # Dépendances et scripts npm
├── readme.md            # Documentation
├── src/
│   ├── routes/          # Routes API
│   ├── controllers/      # Logique métier
│   ├── models/          # Modèles MongoDB
│   ├── middleware/      # Middleware (authentification, validation)
│   ├── validators/      # Schémas de validation Joi
│   └── config/          # Configuration de l'application
├── tests/               # Tests unitaires
└── documentation/       # Documentation Swagger
```

## ⚙️ Contraintes techniques

- Express.js pour l'API REST
- Authentification JWT pour la sécurité
- MongoDB avec Mongoose pour la persistance des données
- Validation stricte des données
- Documentation API avec Swagger
- Tests unitaires de base avec Jest

## 📊 Critères d'évaluation

- ✅ Respect du sujet et des fonctionnalités demandées
- ✅ Qualité du code et de l'architecture
- ✅ Validation des données et cohérence des réponses API
- ✅ Utilisation correcte de Git et organisation du travail
- ✅ Documentation de l'API
- ✅ Présence de tests unitaires de base
- ✅ Clarté globale du projet

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Configuration (créer .env)
# Éditer le fichier .env avec vos paramètres

# Démarrage
npm start

# Tests
npm test

# Accès à la documentation API
# http://localhost:3000/api-docs
```

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur

### Utilisateurs
- `GET /api/users` - Lister les utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Clients
- `GET /api/clients` - Lister les clients
- `POST /api/clients` - Créer un client
- `GET /api/clients/:id` - Détails d'un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Factures
- `GET /api/invoices` - Lister les factures
- `POST /api/invoices` - Créer une facture
- `GET /api/invoices/:id` - Détails d'une facture
- `PUT /api/invoices/:id` - Modifier une facture

### Paiements
- `POST /api/payments` - Enregistrer un paiement

### Actions de recouvrement
- `GET /api/recovery-actions` - Lister les actions
- `POST /api/recovery-actions` - Créer une action
- `PUT /api/recovery-actions/:id` - Modifier une action

### Statistiques
- `GET /api/statistics` - Obtenir les statistiques

## 👨‍💼 Rôles et permissions

- **Admin** : Accès complet à toutes les fonctionnalités
- **Manager** : Gestion des clients, factures et actions
- **Agent** : Consultation et mise à jour des actions de recouvrement

## 📧 Contact et support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

---

**Dernière mise à jour** : Mars 2026
