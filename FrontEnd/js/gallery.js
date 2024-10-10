// URL de l'API 
const apiUrl = 'http://localhost:5678/api/works';

// Récupérer les travaux depuis le back-end
async function fetchWorks() {
    try {
        const response = await fetch(apiUrl); 
        return await response.json();  
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
    }
}

// Fonction pour afficher les travaux dans la galerie avec un bouton "Supprimer" si connecté
function displayWorks(item) {
    const gallery = document.querySelector('.gallery');
  
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = item.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajouter des icônes si l'utilisateur est connecté
    const token = localStorage.getItem('token'); // Vérifier si l'utilisateur est connecté
    if (token) {
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('icon-container');
        
        // Icône "Modifier"
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
        editIcon.title = 'Modifier';
        iconContainer.appendChild(editIcon);

        // Icône "Supprimer"
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
        deleteIcon.title = 'Supprimer';
        deleteIcon.dataset.id = item.id;

        // Ajouter l'événement de suppression
        deleteIcon.addEventListener('click', async () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                await deleteWork(item.id); // Appeler la fonction de suppression
                figure.remove(); // Retirer l'élément du DOM après suppression
            }
        });

        iconContainer.appendChild(deleteIcon);

        // Ajouter les icônes en haut à droite du projet
        figure.appendChild(iconContainer);
    }

    gallery.appendChild(figure);
}

// Fonction pour supprimer un travail via l'API
async function deleteWork(id) {
    const token = localStorage.getItem('token'); // Récupérer le token pour l'authentification
    
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajouter l'en-tête d'authentification
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du projet');
        }

        console.log('Projet supprimé avec succès');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour générer le menu de catégories
function generateCategoryMenu(works) {
    const categoriesContainer = document.querySelector('.categories');
    
    // Vider le conteneur des catégories pour éviter les doublons
    categoriesContainer.innerHTML = '';

    const allCategories = new Set();  

    // Ajouter une catégorie spéciale "Tous"
    allCategories.add({ id: 0, name: "Tous" });

    // Extraire les catégories des travaux en utilisant l'ID
    works.forEach(work => {
        if (![...allCategories].some(category => category.id === work.category.id)) {
            allCategories.add(work.category);
        }
    });

    // Créer un bouton pour chaque catégorie unique
    allCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.categoryId = category.id;

        if (category.id === 0) {
            button.classList.add('active');
        }

        // Ajouter un événement pour filtrer les travaux selon la catégorie sélectionnée
        button.addEventListener('click', () => {

            const allButtons = document.querySelectorAll('.categories button');
            
            allButtons.forEach(btn => btn.classList.remove('active'));

            // Ajouter la classe "active" au bouton cliqué
            button.classList.add('active');
            
            // Filtrer et afficher les travaux
            if (category.id === 0) {
                // Afficher tous les travaux
                displayFilteredWorks(works);
            } else {
                // Filtrer les travaux selon la catégorie sélectionnée
                const filteredWorks = works.filter(work => work.category.id === category.id);
                displayFilteredWorks(filteredWorks);
            }
        });

        categoriesContainer.appendChild(button);
    });
}

// Fonction pour afficher les travaux filtrés
function displayFilteredWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';  
    works.forEach(displayWorks);  
}

// Charger les travaux et générer le menu de catégories
async function loadWorks() {
    const works = await fetchWorks();  
    displayFilteredWorks(works);  
    generateCategoryMenu(works);  
}

// Fonction pour afficher ou masquer le bouton "modifier" en fonction de l'état de connexion
function toggleEditButton() {
    const editButton = document.getElementById('edit-button');
    const token = localStorage.getItem('token');  // Vérifie si un token existe dans le localStorage

    if (token) {
        // Si le token existe, l'utilisateur est connecté => Affiche le bouton "modifier"
        editButton.style.display = 'inline-flex';  // Affiche le bouton
    } else {
        // Si le token n'existe pas, l'utilisateur n'est pas connecté => Cache le bouton
        editButton.style.display = 'none';  // Masque le bouton
    }
}

// Fonction pour mettre à jour le lien "login" ou "logout"
function updateAuthLink() {
    const authLink = document.getElementById('auth-link');
  
    // Vérifier si le token est stocké dans le localStorage
    const token = localStorage.getItem('token');
  
    // Supprimer les anciens événements pour éviter les doublons
    authLink.replaceWith(authLink.cloneNode(true));
    const newAuthLink = document.getElementById('auth-link');
  
    if (token) {
        // Si un token est trouvé, l'utilisateur est connecté => Afficher "logout"
        newAuthLink.textContent = 'logout';
  
        // Ajouter un événement pour gérer la déconnexion
        newAuthLink.addEventListener('click', function() {
            // Supprimer le token du localStorage
            localStorage.removeItem('token');
  
            // Rediriger vers la page de login après déconnexion
            window.location.href = 'login.html';
        });
    } else {
        // Si aucun token n'est trouvé, l'utilisateur n'est pas connecté => Afficher "login"
        newAuthLink.textContent = 'login';
  
        // Ajouter un événement pour rediriger vers la page de connexion
        newAuthLink.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    toggleEditButton();  // Met à jour l'affichage du bouton "modifier" après changement de connexion
}
  
// Appeler les fonctions lors du chargement de la page pour charger les travaux, mettre à jour le lien "login/logout" et afficher le bouton "modifier"
document.addEventListener('DOMContentLoaded', () => {
    loadWorks();
    updateAuthLink(); 
});







  