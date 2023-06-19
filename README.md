# Bioponi

## Backend

**NodeJS** pour créer et faire tourner le webserver.  
**Express** pour créer les endpoints et gérer les routes.  
**Prisma** pour modéliser la base de données (bdd).

- Avant de lancer le webserver, il faut exécuter **Docker** qui permet de faire tourner la bdd de l'application. Les paramètres de Docker sont enregistrés
dans le fichier docker-compose.yml. La base de données utilise PostgreSQL.

- Lancer le web server, se placer dans le dossier /back:
```
npx nodemon server
```

- Génerer les entrées de la bdd. A la première utilisation, il faut lancer en ligne de commande- suivante qui permet de créer la bdd
```
npx prisma generate
```

- Créer un utilisateur: il faut utiliser **Postman** et envoyer une requête POST avec comme paramètres: name, email, password.
Ensuite il faut récupérer le token comme réponse de la requête et sur les prochaines requêtes il faudra définir
un header appelé **x-auth** avec comme valeur le token reçu.  
La création d'un utilisateur crée aussi un bassin par défaut, quelques espèces de poissons de base (TAEC, saumon, Tilapia etc ..), et un aliment de base.

## Frontend

**React** comme librairie.  
**react-hook-form** pour gérer les form.  
**material-ui** pour afficher des grilles, des dialogue modaux, et d'autres composants.  
**react-chartJS** pour afficher les données sous forme de courbe.  

Pour installer les dépendances du projet, se placer dans le dossier /front:  ```npm instal```.  
Il peut arriver qu'il y ait des problèmes de dépendance avec material-ui, dans ce cas il faut utiliser la commande npm install ```npm i --legacy-peer-deps```.
