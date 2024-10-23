// ===========================
// CONFIGURATION ET FETCH DES DONNÉES
// ===========================

// URL de l'API des travaux
const apiUrl = 'http://localhost:5678/api/works';

// Fonction pour récupérer les travaux depuis le back-end
async function fetchWorks() {
    try {
        const response = await fetch(apiUrl); // Effectue la requête GET
        return await response.json();  // Retourne les travaux sous forme d'objets JSON
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);  // Affiche l'erreur en cas d'échec
    }
}


// ===========================
// AFFICHAGE DES TRAVAUX DANS LA GALERIE
// ===========================

// Fonction pour afficher chaque travail dans la galerie
// Si l'utilisateur est connecté, ajouter des icônes "Modifier" et "Supprimer"
function displayWorks(item) {
    const gallery = document.querySelector('.gallery');  // Sélectionne la galerie pour afficher les travaux

    // Crée l'élément figure pour chaque travail
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = item.imageUrl;  // Définit la source de l'image du projet
    img.alt = item.title;  // Définit l'attribut alt pour l'accessibilité

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.title;  // Affiche le titre du travail

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);  // Ajoute le projet à la galerie
}


// ===========================
// SUPPRESSION DES TRAVAUX
// ===========================

// Fonction pour supprimer un travail via l'API
async function deleteWork(id) {
    const token = localStorage.getItem('token');  // Récupère le token pour l'authentification
    
    try {
        // Effectue la requête DELETE pour supprimer le travail
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Utilise le token pour autoriser l'action
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du projet');  // Si la requête échoue
        }

        console.log('Projet supprimé avec succès');  // Confirmation dans la console
    } catch (error) {
        console.error('Erreur:', error);  // Affiche une erreur en cas d'échec
    }
}


// ===========================
// GÉNÉRATION DU MENU DE CATÉGORIES
// ===========================

// Fonction pour générer dynamiquement le menu des catégories
function generateCategoryMenu(works) {
    const categoriesContainer = document.querySelector('.categories');  // Sélectionne le conteneur des catégories
    
    categoriesContainer.innerHTML = '';  // Vider le conteneur pour éviter les doublons

    const allCategories = new Set();  // Utilise un Set pour éviter les doublons

    // Ajoute une catégorie spéciale "Tous"
    allCategories.add({ id: 0, name: "Tous" });

    // Parcourt chaque travail pour extraire les catégories
    works.forEach(work => {
        if (![...allCategories].some(category => category.id === work.category.id)) {
            allCategories.add(work.category);  // Ajoute la catégorie si elle n'existe pas encore
        }
    });

    // Crée un bouton pour chaque catégorie unique
    allCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;  // Définit le nom de la catégorie
        button.dataset.categoryId = category.id;  // Stocke l'ID de la catégorie

        if (category.id === 0) {
            button.classList.add('active');  // Marque le bouton "Tous" comme actif par défaut
        }

        // Ajoute un événement de clic pour filtrer les travaux selon la catégorie sélectionnée
        button.addEventListener('click', () => {
            const allButtons = document.querySelectorAll('.categories button');
            
            allButtons.forEach(btn => btn.classList.remove('active'));  // Désactive tous les boutons
            button.classList.add('active');  // Active le bouton cliqué
            
            // Filtrer et afficher les travaux selon la catégorie
            if (category.id === 0) {
                displayFilteredWorks(works);  // Affiche tous les travaux
            } else {
                const filteredWorks = works.filter(work => work.category.id === category.id);  // Filtre par catégorie
                displayFilteredWorks(filteredWorks);  // Affiche les travaux filtrés
            }
        });

        categoriesContainer.appendChild(button);  // Ajoute le bouton au conteneur
    });
}


// ===========================
// AFFICHAGE DES TRAVAUX FILTRÉS
// ===========================

// Fonction pour afficher les travaux filtrés dans la galerie
function displayFilteredWorks(works) {
    const gallery = document.querySelector('.gallery');  // Sélectionne la galerie
    gallery.innerHTML = '';  // Vide la galerie avant d'afficher les nouveaux travaux
    works.forEach(displayWorks);  // Affiche chaque travail
}


// ===========================
// CHARGEMENT DES TRAVAUX
// ===========================

// Fonction principale pour charger les travaux et générer le menu de catégories
async function loadWorks() {
    const works = await fetchWorks();  // Récupère les travaux
    displayFilteredWorks(works);  // Affiche les travaux dans la galerie
    generateCategoryMenu(works);  // Génère le menu de catégories
}


// ===========================
// GESTION DES BOUTONS DE CONNEXION
// ===========================

// Fonction pour afficher ou masquer le bouton "modifier" selon l'état de connexion
function toggleEditButton() {
    const editButton = document.getElementById('edit-button');
    const adminBar = document.getElementById('admin-bar'); // Sélection de la barre noire
    const token = localStorage.getItem('token');  // Vérifie si un token existe dans le localStorage

    if (token) {
        // Si le token existe, l'utilisateur est connecté => Affiche le bouton "modifier" et la barre noire
        editButton.style.display = 'inline-flex';
        adminBar.classList.remove('hidden');  // Affiche la barre noire
    } else {
        // Si le token n'existe pas, l'utilisateur n'est pas connecté => Cache le bouton et la barre noire
        editButton.style.display = 'none';
        adminBar.classList.add('hidden');  // Cache la barre noire
    }
}


// ===========================
// GESTION DU LIEN "LOGIN/LOGOUT"
// ===========================

// Fonction pour mettre à jour le lien "login" ou "logout" selon l'état de connexion
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');

    // Vérifie si un token est stocké dans le localStorage
    const token = localStorage.getItem('token');

    // Remplacer l'ancien lien pour éviter les doublons d'événements
    authLink.replaceWith(authLink.cloneNode(true));
    const newAuthLink = document.getElementById('auth-link');

    if (token) {
        // Si un token est trouvé, l'utilisateur est connecté => Affiche "logout"
        newAuthLink.textContent = 'logout';

        // Ajoute un événement pour la déconnexion
        newAuthLink.addEventListener('click', function() {
            localStorage.removeItem('token');  // Supprime le token
            window.location.href = 'login.html';  // Redirige vers la page de connexion
        });
    } else {
        // Si aucun token n'est trouvé, l'utilisateur n'est pas connecté => Affiche "login"
        newAuthLink.textContent = 'login';

        // Ajoute un événement pour rediriger vers la page de connexion
        newAuthLink.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    toggleEditButton();  // Met à jour l'affichage du bouton "modifier" et la barre noire
}


// ===========================
// INITIALISATION DU SITE
// ===========================

// Lorsque la page est chargée, exécuter les fonctions pour charger les travaux et mettre à jour les liens
document.addEventListener('DOMContentLoaded', () => {
    loadWorks();  // Charge les travaux et génère le menu de catégories
    updateAuthLink();  // Met à jour le lien "login/logout"
});










  








  








  