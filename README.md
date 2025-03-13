# SPOTILIKE By Damien CHOQUET


## Guide d'installation et d'exécution de Spotilike
<br></br>

## Lien du repo Github
[Repo github spotilike](https://github.com/damienien/express-spotilike)

<br></br>

## Accéder à l'application hébergé depuis AWS (demo de l'application)
[express-spotilike](http://13.43.63.48)

<br></br>

## Installation

### Backend

1. Naviguez vers le dossier backend :

2. Installez les dépendances :

```
npm install
```


### Frontend

1. Naviguez vers le dossier front/spotilike :

2. Installez les dépendances :

```
npm install
```


## Exécution

### Backend

1. Depuis le dossier backend, lancez le serveur avec la commande :
```
nodemon server
```


### Frontend

1. Dans un second terminal, naviguez vers le dossier front/spotilike :

2. Lancez l'application front-end avec la commande :
```
npm run start
```
<br></br>
<br></br>

## Guide de déploiement du projet Express-Spotilike sur AWS EC2

Ce guide vous aidera à déployer le projet Express-Spotilike sur une instance AWS EC2 en utilisant Terraform et Ansible.

### Prérequis

- Compte AWS
- Terraform installé
- Ansible installé
- Clé SSH générée
- Compte MongoDB avec un cluster de disponible
- Avoir installer les librairies du front et du backend (voir la partie du dessus "Installation")


### Initialisation du fichier .env dans le backend
Le projet ayant une base de données MongoDB, il est nécessaire d'avoir un compte et un cluster d'ouvert sur MongoDB, une fois cela fait, copier l'URI de votre cluster et coller le dans le fichier .env-template se trouvant dans le dossier "backend".
pensez également à modifier la variable d'environnement JWT_SECRET et d'y insérer votre clé privée.
Une fois cela fait renommer le fichier .env-template en .env

```sh
NODE_ENV = development
MONGO_URI = ""
JWT_SECRET = ""
SPOTIFY_KEY = ""
SPOTIFY_CLIENT_ID = ""
```

### Génération de la clé SSH
Il est nécessaire de créer et d'importer une clé SSH sur votre instance EC2 en 2048 (norme européenne) pour que cela fonctionne.
Pour générer une clé SSH en 2048, utilisez la commande suivante dans votre terminal :

```sh
ssh-keygen -t rsa -b 2048 -C "votre-email@example.com"
```

### Importation de la clé SSH dans AWS
Pour importer la clé SSH dans AWS, utilisez la commande suivante :

```sh
aws ec2 import-key-pair --key-name "ec2-key" --public-key-material fileb://~/.ssh/id_rsa.pub --region eu-west-2
```

### Création et liaison d'une adresse IP élastique

Pour créer une adresse IP élastique et la lier à votre instance EC2, vous pouvez utiliser le tableau de bord AWS ou les commandes AWS CLI.

### Déploiement avec Terraform et Ansible

1. Naviguez vers le répertoire `aws-terraform` et initialisez Terraform :

```sh
cd express-spotilike/aws-terraform
terraform init
```

2. Appliquez le plan Terraform :

```sh
terraform apply
```
3. Une fois l'instance EC2 créé, si une adresse elastique a été configuré et lié via la console d'EC2 copié l'adresse IPV4 de l'instance et collée la dans les fichiers :
    <details><summary>aws-ansible</summary>
        - "hosts" en remplacant l'adresse ip déjà indiqué.
    </details>
    <details><summary>frontend</summary>
    <details>
    <summary>src</summary>
        - "config.js" remplacer la variable "apiUrl" par le lien de votre instance EC2
    </details>
    </details>

4. Naviguez vers le répertoire `aws-ansible` et exécutez le playbook Ansible :

```sh
cd ../aws-ansible
ansible-playbook deploy.yml
```

## Exécution locale avec Docker Compose

Si vous souhaitez exécuter l'application localement à l'aide de Docker Compose, vous pouvez utiliser le fichier `docker-compose.yml` à la racine du projet.

1. Construisez et démarrez les conteneurs :

```sh
docker-compose up --build
```

2. Pour arrêter et supprimer les conteneurs, utilisez :

```sh
docker-compose down
```

Notez que vous devez avoir Docker et Docker Compose installés sur votre machine pour exécuter ces commandes.

## Routes

- `/` : Page de connexion
- `/home` : Page principale de l'application
- `/register` : Page d'inscription
- `/albums` : Liste des albums
- `/albums/:id` : Détails d'un album spécifique
- `/albums/edit/:id` : Modifier un album existant
- `/albums/create` : Créer un nouvel album
- `/artists` : Liste des artistes
- `/artists/edit/:id` : Modifier un artiste existant
- `/artists/:id` : Détails d'un artiste spécifique
- `/artists/create` : Créer un nouvel artiste

Ces routes sont utilisées dans l'application et correspondent aux différents points d'accès de l'interface utilisateur. Vous pouvez les utiliser pour naviguer dans l'application Spotilike après son exécution


## Routes Backend - Albums

- GET `/api/albums` : Récupère tous les albums
- GET `/api/albums/:id` : Récupère les détails d'un album spécifique avec ses artistes associés
- GET `/api/albums/songs/:id` : Récupère tous les morceaux d'un album spécifique
- POST `/api/albums/create` : Crée un nouvel album (authentification requise)
- POST `/api/albums/songs/:id` : Ajoute un morceau à un album spécifique (authentification requise)
- PUT `/api/albums/:id` : Modifie un album existant (authentification requise)
- DELETE `/api/albums/:id` : Supprime un album spécifique (authentification requise)
- DELETE `/api/albums/songs/:id` : Supprime un morceau d'un album spécifique


## Routes Backend - Artistes

- POST `/api/artists/create` : Crée un nouvel artiste (authentification requise)
- GET `/api/artists/:id` : Récupère les détails d'un artiste spécifique par son ID
- GET `/api/artist/:id` : Récupère tous les détails d'un artiste spécifique, y compris ses morceaux associés, par son ID
- GET `/api/artists/:id/songs` : Récupère tous les morceaux associés à un artiste spécifique par son ID
- GET `/api/artists` : Récupère tous les artistes
- PUT `/api/artists/:id` : Modifie un artiste existant par son ID (authentification requise)
- DELETE `/api/artists/:id` : Supprime un artiste spécifique par son ID (authentification requise)


## Routes Backend - Genres

- POST `/api/create/genre` : Crée un nouveau genre
- GET `/api/genres` : Récupère tous les genres
- PUT `/api/genres/:id` : Modifie un genre existant par son ID


## Routes Backend - Morceaux

- POST `/api/create/song` : Crée un nouveau morceau
- GET `/api/songs/:id` : Récupère les détails d'un morceau spécifique avec son genre associé par son ID
- GET `/api/songs` : Récupère tous les morceaux


## Routes Backend - Authentification

- POST `/api/register` : Inscrit un nouvel utilisateur
- POST `/api/login` : Connecte un utilisateur existant
- GET `/api/me` : Récupère les informations de l'utilisateur connecté (authentification requise)
