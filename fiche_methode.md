
# Fiche Méthode : Création API REST avec Node.js (Router & CRUD)

## Objectifs
- Structurer une API REST en utilisant Node.js avec une logique CRUD.
- Utiliser `router` pour organiser les routes.

---

## Étape 1 : Initialisation du projet
1. **Créer un projet Node.js** :
   ```bash
   mkdir api-rest-tutorial
   cd api-rest-tutorial
   npm init -y
   ```
2. **Installer Express** :
   ```bash
   npm install express
   ```

---

## Étape 2 : Créer la structure des dossiers
Organisez vos fichiers comme suit :

```
api-rest-tutorial/
├── controllers/
│   └── exampleController.js
├── models/
│   └── exampleModel.js
├── middlewares/
│   └── uselessMiddleware.js
├── routes/
│   └── exampleRoutes.js
├── index.js
└── package.json
```

---

## Étape 3 : Écrire le modèle
Fichier : `models/exampleModel.js`
```javascript
const exampleModel = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" }
];

module.exports = exampleModel;
```

---

## Étape 4 : Écrire le contrôleur
Fichier : `controllers/exampleController.js`
```javascript
const exampleModel = require("../models/exampleModel");

// Obtenir tous les éléments
const getAllItems = (req, res) => {
    res.json(exampleModel);
};

// Obtenir un élément par ID
const getItemById = (req, res) => {
    const item = exampleModel.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
};

// Créer un nouvel élément
const createItem = (req, res) => {
    const newItem = { id: exampleModel.length + 1, name: req.body.name };
    exampleModel.push(newItem);
    res.status(201).json(newItem);
};

// Mettre à jour un élément existant
const updateItem = (req, res) => {
    const item = exampleModel.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.name = req.body.name || item.name;
    res.json(item);
};

// Supprimer un élément
const deleteItem = (req, res) => {
    const index = exampleModel.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Item not found" });
    exampleModel.splice(index, 1);
    res.status(204).send();
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
```

---

## Étape 5 : Créer le router
Fichier : `routes/exampleRoutes.js`
```javascript
const express = require("express");
const router = express.Router();
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require("../controllers/exampleController");

// Définir les routes CRUD
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
```

---

## Étape 6 : Configurer le serveur
Fichier : `index.js`
```javascript
const express = require("express");
const exampleRoutes = require("./routes/exampleRoutes");

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Utilisation des routes
app.use("/api/items", exampleRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

## Étape 7 : Tester l'API
1. **Lancer le serveur** :
   ```bash
   node index.js
   ```
2. **Tester les routes CRUD avec un outil comme Postman** :
   - **GET** `/api/items` : Obtenir tous les éléments.
   - **GET** `/api/items/:id` : Obtenir un élément par ID.
   - **POST** `/api/items` : Créer un nouvel élément (corps : `{ "name": "New Item" }`).
   - **PUT** `/api/items/:id` : Mettre à jour un élément (corps : `{ "name": "Updated Item" }`).
   - **DELETE** `/api/items/:id` : Supprimer un élément.

---

## Points clés
- **Router** : Simplifie la gestion des routes en regroupant les endpoints liés.
- **Contrôleur** : Contient la logique métier.
- **Modèle** : Simule les données (peut être remplacé par une base de données).
- **Middleware JSON** : Nécessaire pour traiter les corps de requêtes POST et PUT.

---

Cette fiche méthode vous permet de construire une API REST avec une structure modulaire et une logique CRUD complète.