document.addEventListener('DOMContentLoaded', function () { // Attends que le DOM soit complètement chargé avant d'exécuter le script

    let modal = null; // Variable pour stocker l'élément de la modale actuellement ouverte
    let currentStep = 1; // Étape actuelle dans la modale (1 pour Galerie, 2 pour Ajout de projet)
    let selectedImage = null; // Image actuellement sélectionnée pour le téléchargement

    // Récupération des éléments du DOM nécessaires
    const fileInput = document.getElementById('file-input'); // Input pour le téléchargement de fichier
    const addPhotoBtn = document.getElementById('add-photo-btn'); // Bouton d'ajout de photo
    const uploadSection = document.querySelector('.upload-section'); // Section de téléchargement d'image
    const selectedImagePreview = document.querySelector('.selected-upload-image'); // Aperçu de l'image sélectionnée
    const uploadIcon = document.querySelector('.upload-icon'); // Icône de téléchargement affichée par défaut
    const categorySelect = document.getElementById('category-select'); // Sélecteur de catégories pour les projets
    const addProjectForm = document.getElementById('add-photo-form');// Récupération du formulaire d'ajout de projet


    // ===========================
    // GESTION DU BOUTON D'AJOUT DE PHOTO
    // ===========================
    
    addPhotoBtn.addEventListener('click', function () { // Attache un événement au clic sur le bouton d'ajout de photo
        fileInput.click(); // Ouvre la boîte de dialogue pour sélectionner un fichier image
    });

    fileInput.addEventListener('change', function (e) { // Exécute la fonction quand un fichier est sélectionné dans le champ
        const file = e.target.files[0]; // Récupère le premier fichier sélectionné
        if (file) { // Vérifie si un fichier a bien été sélectionné
            const reader = new FileReader(); // Crée un nouvel objet FileReader pour lire le contenu du fichier
            reader.onload = function (event) { // Définie une fonction pour l'événement 'load' du FileReader
                uploadIcon.style.display = 'none'; // Cache l'icône de téléchargement
                addPhotoBtn.style.display = 'none'; // Cache le bouton d'ajout de photo
                document.querySelector('.file-info').style.display = 'none'; // Cache les informations du fichier
                selectedImagePreview.src = event.target.result; // Définit l'aperçu de l'image avec le contenu du fichier
                selectedImagePreview.style.display = 'block'; // Affiche l'aperçu de l'image sélectionnée
            };
            reader.readAsDataURL(file); // Lit le fichier comme URL pour l'afficher dans l'aperçu
        }
    });
    
    // ===========================
    // FONCTION D'OUVERTURE DE LA MODALE
    // ===========================
    
    const openModal = function (e) { // Déclare la fonction pour ouvrir la modale
        e.preventDefault(); // Empêche le comportement par défaut de l'élément cliqué

        modal = document.querySelector('#modal1'); // Récupère l'élément modale ciblé par le lien
        if (!modal) return; // Vérifie si la modale existe, sinon stoppe la fonction

        // history.pushState({ modalOpen: true }, null, window.location.href); // Ajoute un état dans l'historique de navigation
        modal.style.display = 'block'; // Affiche la modale en la rendant visible
        modal.style.pointerEvents = 'auto'; // Active les événements pour la modale
        modal.style.opacity = '1'; // Rend la modale complètement opaque
        modal.removeAttribute('aria-hidden'); // Retire l'attribut pour rendre la modale accessible
        modal.setAttribute('aria-modal', 'true'); // Ajoute un attribut d'accessibilité indiquant que c'est une modale

        const stopElement = modal.querySelector('.js-modal-stop'); // Sélectionne l'élément pour stopper la propagation de clic
        if (stopElement) stopElement.addEventListener('click', stopPropagation); // Empêche la propagation des clics dans la modale

        modal.addEventListener('click', closeModal); // Ajoute un événement de fermeture de la modale au clic en dehors de celle-ci
        const closeButton = modal.querySelector('.js-modal-close'); // Récupère le bouton de fermeture de la modale
        if (closeButton) closeButton.addEventListener('click', closeModal); // Ajoute un événement de fermeture au bouton de fermeture

        const backButton = modal.querySelector('.back-button'); // Récupère le bouton de retour dans la modale
        if (backButton) backButton.addEventListener('click', previousStep); // Ajoute un événement de retour pour le bouton

        loadCategories(); // Appelle la fonction pour charger les catégories disponibles
        showGalleryStep(); // Appelle la fonction pour afficher l'étape Galerie dans la modale
    };

    // ===========================
    // FONCTION POUR CHARGER LES CATÉGORIES
    // ===========================
    
    const loadCategories = function () { // Déclare la fonction pour charger les catégories depuis l'API
        fetch('http://localhost:5678/api/categories') // Envoie une requête GET à l'API des catégories
            .then(response => response.json()) // Transforme la réponse en JSON
            .then(categories => { // Utilise les données des catégories récupérées
                categorySelect.innerHTML = ''; // Vide la liste de catégories dans le sélecteur
                categories.forEach(category => { // Parcourt chaque catégorie
                    const option = document.createElement('option'); // Crée un élément option pour le sélecteur
                    option.value = category.id; // Associe l'ID de la catégorie comme valeur de l'option
                    option.textContent = category.name; // Utilise le nom de la catégorie pour l'affichage
                    categorySelect.appendChild(option); // Ajoute l'option dans le sélecteur
                });
            })
            .catch(error => console.error('Erreur lors du chargement des catégories:', error)); // Affiche une erreur si la requête échoue
    };

    // ===========================
    // FONCTION DE FERMETURE DE LA MODALE
    // ===========================

    const closeModal = function (e) { // Déclare la fonction pour fermer la modale
        if (e && e.preventDefault) e.preventDefault(); // Empêche l'action par défaut de l'événement, s'il existe

        resetSelection(); // Réinitialise la sélection d'image dans la modale
        if (!modal) return; // Vérifie si la modale existe, sinon stoppe la fonction

        modal.style.opacity = '0'; // Diminue l'opacité de la modale pour la rendre invisible
        modal.style.pointerEvents = 'none'; // Désactive les événements sur la modale
        modal.style.display = 'none'; // Masque complètement la modale
        modal.setAttribute('aria-hidden', 'true'); // Marque la modale comme masquée pour l'accessibilité
        modal.removeAttribute('aria-modal'); // Supprime l'attribut modale d'accessibilité
        modal.removeEventListener('click', closeModal); // Retire l'événement de fermeture de la modale
        modal = null; // Réinitialise la variable modale à null
    };

    const stopPropagation = function (e) { // Empêche la propagation de l'événement de clic
        e.stopPropagation();
    };

    document.querySelectorAll('.js-modal').forEach(a => a.addEventListener('click', openModal)); // Ouvre la modale au clic

    window.addEventListener('keydown', function (e) { // Ferme la modale si la touche Échap est pressée
        if ((e.key === 'Escape' || e.key === 'Esc') && modal) closeModal(e);
    });

    window.addEventListener('popstate', function (e) { // Ferme la modale au retour dans l'historique
        if (modal) closeModal();
    });

    // ===========================
    // GESTION DES ÉTAPES DANS LA MODALE
    // ===========================

    const nextStep = function () { // Affiche la section d'ajout de projet et masque la galerie
        if (selectedImage) { // Affiche l'image sélectionnée si elle existe
            uploadIcon.style.display = 'none';
            selectedImagePreview.src = selectedImage.src;
            selectedImagePreview.classList.add('selected-upload-image');
            selectedImagePreview.style.display = 'block';
        }
        document.getElementById('gallery-section').style.display = 'none'; // Cache la section Galerie
        document.getElementById('new-project-section').style.display = 'block'; // Affiche la section d'ajout de projet
        document.querySelector('.back-button').style.display = 'block'; // Affiche le bouton de retour
        document.getElementById('titlemodal').textContent = 'Ajout de projet'; // Modifie le titre de la modale
        currentStep = 2; // Passe à l'étape suivante
    };

    const previousStep = function () { // Retourne à la section Galerie dans la modale
        resetSelection(); // Réinitialise la sélection d'image
        fileInput.value = ''; // Réinitialise le champ de fichier pour permettre une nouvelle sélection
        document.getElementById('new-project-section').style.display = 'none'; // Masque la section d'ajout de projet
        document.getElementById('gallery-section').style.display = 'block'; // Affiche la section Galerie
        document.querySelector('.back-button').style.display = 'none'; // Masque le bouton de retour
        document.getElementById('titlemodal').textContent = 'Galerie photo'; // Modifie le titre de la modale
        currentStep = 1; // Retourne à l'étape initiale

           // Réinitialise le champ de texte du titre
    const titleInput = document.getElementById('title-input'); // Sélectionne le champ de texte
    if (titleInput) {
        titleInput.value = ''; // Vide le champ de texte
    }

    // Supprime l'aperçu de l'image et masque son affichage
    selectedImagePreview.src = ''; // Supprime l'aperçu de l'image
    selectedImagePreview.style.display = 'none'; // Masque l'aperçu
    };

    const showGalleryStep = function () { // Affiche l'étape Galerie dans la modale
        document.getElementById('gallery-section').style.display = 'block';
        document.getElementById('new-project-section').style.display = 'none';
        document.querySelector('.back-button').style.display = 'none';
        document.getElementById('titlemodal').textContent = 'Galerie photo';
        loadGallery();
    };

    const uploadButton = document.querySelector('.upload-button'); // Récupère le bouton d'upload
    if (uploadButton) uploadButton.addEventListener('click', nextStep); // Passe à l'étape suivante au clic sur le bouton d'upload

    // ===========================
    // FONCTION POUR CHARGER LA GALERIE
    // ===========================

    const loadGallery = function () { // Fonction pour charger la galerie dans la modale
        const galleryContainer = document.querySelector('.galleryModal');
        galleryContainer.innerHTML = ''; // Vide le conteneur de la galerie

        fetch('http://localhost:5678/api/works') // Récupère les travaux depuis l'API
            .then(response => {
                if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                return response.json();
            })
            .then(photos => photos.forEach(photo => addProjectToGallery(photo))) // Ajoute chaque projet dans la galerie modale
            .catch(error => console.error('Erreur lors du chargement des photos:', error));
    };

    // ===========================
    // FONCTION POUR AJOUTER UN PROJET DANS LA GALERIE
    // ===========================

    const addProjectToGallery = function (photo) { // Ajoute un projet donné dans la galerie modale
        const galleryContainer = document.querySelector('.galleryModal');
        const figure = document.createElement('figure');
        figure.style.position = 'relative';

        const img = document.createElement('img'); // Crée un élément img et configure ses attributs
        img.src = photo.imageUrl;
        img.alt = photo.title;
        figure.appendChild(img);

        const deleteButton = document.createElement('button'); // Crée un bouton de suppression pour chaque projet
        deleteButton.classList.add('delete-icon');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                        
        deleteButton.addEventListener('click', async () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                await deleteWork(photo.id, photo.imageUrl); // Passez l'URL et l'ID ici
            }
        });
        

        figure.appendChild(deleteButton); // Ajoute le bouton de suppression au projet
        galleryContainer.appendChild(figure); // Ajoute le projet complet à la galerie modale
    };

    // ===========================
// FONCTION POUR AJOUTER UN PROJET À LA GALERIE PRINCIPALE
// ===========================

const addProjectToMainGallery = function (photo) { // Ajoute dynamiquement un projet à la galerie principale
    const mainGallery = document.querySelector('.gallery'); // Sélectionne la galerie principale
    const figure = document.createElement('figure'); // Crée un nouvel élément figure

    const img = document.createElement('img'); // Crée un élément img
    img.src = photo.imageUrl; // Définit la source de l'image
    img.alt = photo.title; // Définit l'attribut alt de l'image
    figure.appendChild(img); // Ajoute l'image au figure

    const figcaption = document.createElement('figcaption'); // Crée un élément figcaption
    figcaption.textContent = photo.title; // Définit le texte du figcaption
    figure.appendChild(figcaption); // Ajoute le figcaption au figure

    mainGallery.appendChild(figure); // Ajoute le nouvel élément figure à la galerie principale
};


    // ===========================
    // FONCTION POUR RETIRER UN PROJET DE LA GALERIE PRINCIPALE
    // ===========================

    function removeFromMainGallery(imageUrl) {
        const mainGallery = document.querySelector('.gallery');
        mainGallery.querySelectorAll('figure').forEach(figure => {
            const image = figure.querySelector('img');
            if (image.src === imageUrl) {
                figure.remove(); // Supprime la figure correspondante
            }
        });
    };

    // ===========================
// FONCTION POUR RETIRER UN PROJET DE LA MODALE
// ===========================

function removeFromModalGallery(imageUrl) {
    const galleryModal = document.querySelector('.galleryModal');
    galleryModal.querySelectorAll('figure').forEach(figure => {
        const image = figure.querySelector('img');
        if (image.src === imageUrl) {
            figure.remove(); // Supprime la figure correspondante
        }
    });
};
    

    // ===========================
    // SUPPRESSION DES TRAVAUX
    // ===========================

    async function deleteWork(id, imageUrl) { // Ajout de `imageUrl` pour identifier directement l'image
        const token = localStorage.getItem('token'); // Récupère le token (si connecté)
        try {
            // Supprime le projet depuis l'API
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    ...(token && { 'Authorization': `Bearer ${token}` }), // Token seulement si connecté
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) throw new Error('Erreur lors de la suppression du projet.');
    
            // Suppression réussie, mise à jour des deux galeries
            removeFromModalGallery(imageUrl); // Retire de la modale
            removeFromMainGallery(imageUrl); // Retire de la galerie principale

        // Recharge la galerie principale depuis l'API
        if (typeof reloadMainGallery === 'function') {
            reloadMainGallery();
        }
            showNotification('Projet supprimé avec succès !', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression du projet:', error);
            showNotification('Erreur lors de la suppression du projet.', 'error');
        }
    }
    

    // ===========================
    // AJOUT DE NOUVEAUX PROJETS
    // ===========================

    addProjectForm.addEventListener('submit', async function (e) {
        e.preventDefault();
    
        const titleInput = document.getElementById('title-input');
        const categoryInput = document.getElementById('category-select');
        const fileInput = document.querySelector('#file-input');
    
        if (!titleInput.value.trim() || !categoryInput.value || !fileInput.files.length) {
            showNotification("Veuillez remplir tous les champs et ajouter une image.", 'error');
            return;
        }
    

        const formData = new FormData(); // Crée un FormData pour les données du formulaire
        formData.append('title', titleInput.value.trim());
        formData.append('category', categoryInput.value);
        formData.append('image', fileInput.files[0]);

        const token = localStorage.getItem('token'); // Récupère le token d'authentification

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi du projet');

            const newProject = await response.json(); // Transforme la réponse en JSON pour récupérer le nouveau projet
            addProjectToGallery(newProject); // Ajoute le projet à la galerie
            addProjectToMainGallery(newProject); // Ajoute à la galerie principale (appel existant ou fonction similaire)
            showNotification('Projet ajouté avec succès !', 'success');

            fileInput.value = ''; // Vide le champ d'upload d'image
            titleInput.value = ''; // Vide le champ de titre
            categorySelect.selectedIndex = 0; // Réinitialise le champ de catégorie
            resetSelection(); // Réinitialise la sélection

            showGalleryStep(); // Retourne à la section Galerie dans la modale
           
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de l\'ajout du projet.', 'error');
        }
    });

    // ===========================
    // RÉINITIALISATION DE LA SÉLECTION
    // ===========================

    const resetSelection = function () { // Réinitialise la sélection de l'image
        if (selectedImage) selectedImage.classList.remove('selected'); // Retire la classe sélectionnée si une image est sélectionnée
        selectedImage = null; // Réinitialise l'image sélectionnée
        uploadIcon.style.display = 'block'; // Affiche l'icône d'upload par défaut
        selectedImagePreview.style.display = 'none'; // Masque l'aperçu de l'image sélectionnée
        selectedImagePreview.src = ''; // Supprime l'aperçu de l'image

        addPhotoBtn.style.display = 'block'; // Affiche le bouton d'ajout de photo
        document.querySelector('.file-info').style.display = 'block'; // Affiche les informations du fichier
    };

    // ===========================
    // NOTIFICATION SYSTEME
    // ===========================

    function showNotification(message, type = 'success') { // Affiche un message de notification
        const notificationBar = document.getElementById('notification-bar'); // Récupère la barre de notification
        notificationBar.textContent = message; // Définit le texte du message
    
        notificationBar.classList.remove('success', 'error'); // Retire les classes précédentes (succès ou erreur)
        notificationBar.classList.add(type); // Ajoute la classe appropriée selon le type

        notificationBar.style.display = 'block'; // Affiche la barre de notification
    
        setTimeout(() => { // Cache la barre après 5 secondes
            notificationBar.style.display = 'none';
        }, 10000);
    }
});



















































































