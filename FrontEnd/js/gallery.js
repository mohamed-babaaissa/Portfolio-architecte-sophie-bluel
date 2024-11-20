// ===========================
// CONFIGURATION ET FETCH DES DONNÉES
// ===========================

const apiUrl = 'http://localhost:5678/api/works';  // URL de l'API pour récupérer les travaux

// Fonction asynchrone pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(apiUrl);  // Effectue une requête GET vers l'API
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);  // Vérifie la réponse HTTP
        return await response.json();  // Convertit la réponse en JSON et la retourne
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);  // Affiche une erreur si la requête échoue
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

// ===========================
// AFFICHAGE DES TRAVAUX DANS LA GALERIE
// ===========================

// Fonction pour afficher chaque travail dans l'élément de galerie
function displayWorks(item) {
    const gallery = document.querySelector('.gallery');  // Sélectionne l'élément de la galerie
    if (!gallery) {
        console.warn("L'élément '.gallery' n'a pas été trouvé.");  // Affiche un avertissement si la galerie n'existe pas
        return;
    }

    const figure = document.createElement('figure');  // Crée un élément figure pour chaque travail
    const img = document.createElement('img');
    img.src = item.imageUrl;  // Définie l'URL de l'image du travail
    img.alt = item.title;  // Définie le texte alternatif de l'image

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.title;  // Ajoute le titre du travail

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);  // Ajoute chaque travail dans la galerie
}

// ===========================
// GÉNÉRATION DU MENU DE CATÉGORIES
// ===========================

// Fonction pour générer dynamiquement le menu de catégories pour les travaux
function generateCategoryMenu(works) {
    const categoriesContainer = document.querySelector('.categories');  // Sélectionne le conteneur des catégories
    if (!categoriesContainer) {
        console.warn("L'élément '.categories' n'a pas été trouvé.");  // Avertit si le conteneur de catégories n'existe pas
        return;
    }

    categoriesContainer.innerHTML = '';  // Vide le conteneur des catégories
    const allCategories = new Set([{ id: 0, name: "Tous" }]);  // Initialise un Set avec la catégorie "Tous"

    // Parcours chaque travail et ajoute sa catégorie dans le Set s'il n'est pas déjà présent
    works.forEach(work => {
        if (![...allCategories].some(category => category.id === work.category.id)) {
            allCategories.add(work.category);  // Ajoute les catégories sans doublon
        }
    });

    // Crée un bouton pour chaque catégorie
    allCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        if (category.id === 0) button.classList.add('active');  // Marque la catégorie "Tous" comme active par défaut

        // Ajoute un événement de clic pour filtrer les travaux selon la catégorie sélectionnée
        button.addEventListener('click', () => {
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtre les travaux par catégorie sélectionnée
            const filteredWorks = category.id === 0 ? works : works.filter(work => work.category.id === category.id);
            displayFilteredWorks(filteredWorks);
        });

        categoriesContainer.appendChild(button);  // Ajoute chaque bouton au conteneur des catégories
    });
}

// ===========================
// AFFICHAGE DES TRAVAUX FILTRÉS
// ===========================

// Fonction pour afficher les travaux filtrés dans la galerie
function displayFilteredWorks(works) {
    const gallery = document.querySelector('.gallery');  // Sélectionne la galerie pour afficher les travaux
    if (!gallery) {
        console.warn("L'élément '.gallery' n'a pas été trouvé.");  // Avertit si la galerie n'existe pas
        return;
    }

    gallery.innerHTML = '';  // Vide la galerie avant d'afficher les travaux filtrés
    works.forEach(displayWorks);  // Affiche chaque travail en utilisant la fonction displayWorks
}

// ===========================
// CHARGEMENT DES TRAVAUX
// ===========================

// Fonction principale pour charger les travaux et générer le menu de catégories
async function loadWorks() {
    const works = await fetchWorks();  // Récupère les travaux
    if (!works) {
        console.warn("Aucun travail n'a été récupéré.");  // Avertit si aucun travail n'est récupéré
        return;
    }
    displayFilteredWorks(works);  // Affiche les travaux dans la galerie
    generateCategoryMenu(works);  // Génère le menu de catégories
}

// ===========================
// GESTION DES BOUTONS DE CONNEXION
// ===========================

// Fonction pour afficher ou masquer le bouton "modifier" et la barre admin selon l'état de connexion
function toggleEditButton() {
    const editButton = document.getElementById('edit-button');  // Sélectionne le bouton "modifier"
    const adminBar = document.getElementById('admin-bar');  // Sélectionne la barre admin
    const categoriesBar = document.querySelector('.categories'); // Sélectionne la barre des catégories
    if (!editButton || !adminBar || !categoriesBar) {
        console.warn("L'un des éléments 'edit-button' ou 'admin-bar' n'a pas été trouvé.");  // Avertit si un des éléments n'est pas trouvé
        return;
    }

    const token = localStorage.getItem('token');  // Récupère le token de connexion
    editButton.style.display = token ? 'inline-flex' : 'none';  // Affiche le bouton si connecté
    adminBar.classList.toggle('hidden', !token);  // Affiche la barre admin si connecté
    categoriesBar.style.display = token ? 'none' : 'block';  // Masque la barre des catégories si connecté
}

// ===========================
// GESTION DE LA GALERIE PRINCIPALE
// ===========================

// Fonction pour recharger la galerie principale
function reloadMainGallery() {
    const mainGallery = document.querySelector('.gallery');
    if (!mainGallery) {
        console.warn("L'élément '.gallery' n'a pas été trouvé.");
        return;
    }

    mainGallery.innerHTML = ''; // Vide la galerie principale

    fetch('http://localhost:5678/api/works') // Requête vers l'API
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            return response.json();
        })
        .then(works => {
            works.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = work.imageUrl;
                img.alt = work.title;

                const figcaption = document.createElement('figcaption');
                figcaption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                mainGallery.appendChild(figure);
            });
        })
        .catch(error => console.error('Erreur lors du rechargement de la galerie principale :', error));
}

// ===========================
// GESTION DU LIEN "LOGIN/LOGOUT"
// ===========================

// Fonction pour mettre à jour le lien d'authentification "login" ou "logout"
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');  // Sélectionne le lien d'authentification
    if (!authLink) {
        console.warn("L'élément 'auth-link' n'a pas été trouvé.");  // Avertit si le lien d'authentification n'est pas trouvé
        return;
    }

    const token = localStorage.getItem('token');  // Récupère le token de connexion
    authLink.replaceWith(authLink.cloneNode(true));  // Remplace le lien pour éviter les doublons d'événements
    const newAuthLink = document.getElementById('auth-link');

    // Modifie le texte du lien selon l'état de connexion et ajoute les événements
    newAuthLink.textContent = token ? 'logout' : 'login';
    newAuthLink.addEventListener('click', function() {
        if (token) {
            localStorage.removeItem('token');  // Supprime le token en cas de déconnexion
            window.location.href = 'login.html';  // Redirige vers la page de connexion
        } else {
            window.location.href = 'login.html';
        }
    });

    toggleEditButton();  // Met à jour l'affichage du bouton "modifier" et de la barre admin
};

// ===========================
// NAVIGATION ARRIÈRE
// ===========================

// Détecte les clics sur "Précédent" et recharge les galeries
window.addEventListener('popstate', () => {
    reloadMainGallery(); // Recharge la galerie principale
  
});



// ===========================
// INITIALISATION DU SITE
// ===========================

// Lorsque la page est complètement chargée, exécute les fonctions de chargement
document.addEventListener('DOMContentLoaded', async () => {
        loadWorks();
        updateAuthLink();
        
});

















  








  








  