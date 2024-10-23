// Attend que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function () {
    let modal = null; // Variable pour stocker la référence de la modale actuellement ouverte
    let currentStep = 1; // Garde trace de l'étape courante (1 pour la galerie, 2 pour l'ajout de projet)
    let selectedImage = null; // Variable pour stocker l'image sélectionnée dans la galerie

    // Sélection des éléments de la modale
    const fileInput = document.getElementById('file-input'); // Input pour sélectionner les fichiers
    const addPhotoBtn = document.getElementById('add-photo-btn'); // Bouton pour ajouter une photo
    const uploadSection = document.querySelector('.upload-section'); // Section pour l'upload de photo
    const selectedImagePreview = document.querySelector('.selected-upload-image'); // Aperçu de l'image sélectionnée
    const uploadIcon = document.querySelector('.upload-icon'); // Icône d'upload
    const categorySelect = document.getElementById('category-select'); // Sélection du champ des catégories

    // ===========================
    // GESTION DU BOUTON D'AJOUT DE PHOTO
    // ===========================

    // Quand le bouton d'ajout de photo est cliqué, ouvrir le sélecteur de fichier
    addPhotoBtn.addEventListener('click', function () {
        fileInput.click();
    });

    // Lorsqu'un fichier est sélectionné, afficher un aperçu de l'image
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader(); // Utilise FileReader pour lire le fichier
            reader.onload = function (event) {
                // Masque l'icône d'upload et affiche l'image sélectionnée
                uploadIcon.style.display = 'none';
                selectedImagePreview.src = event.target.result;
                selectedImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file); // Convertit l'image en URL pour l'affichage
        }
    });

    // ===========================
    // FONCTION D'OUVERTURE DE LA MODALE
    // ===========================

    // Fonction pour ouvrir la modale
    const openModal = function (e) {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        console.log('Modale ouverte');
        modal = document.querySelector(e.target.getAttribute('href')); // Sélectionne la modale cible
        if (!modal) {
            console.error('Modale non trouvée');
            return;
        }

        // Affiche la modale et configure l'état de navigation
        history.pushState({ modalOpen: true }, null, window.location.href);
        modal.style.display = 'block';
        modal.style.pointerEvents = 'auto';

        setTimeout(() => modal.style.opacity = '1', 10); // Ajoute un effet de transition
        modal.removeAttribute('aria-hidden'); // Rend la modale visible pour les lecteurs d'écran
        modal.setAttribute('aria-modal', 'true');

        // Ajoute un écouteur pour stopper la propagation des clics à l'intérieur de la modale
        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) stopElement.addEventListener('click', stopPropagation);

        // Gestion de la fermeture de la modale
        modal.addEventListener('click', closeModal);
        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) closeButton.addEventListener('click', closeModal);

        // Gestion du retour à l'étape précédente
        const backButton = modal.querySelector('.back-button');
        if (backButton) backButton.addEventListener('click', previousStep);

        loadCategories(); // Charge les catégories disponibles
        showGalleryStep(); // Affiche la galerie photo
    };

    // ===========================
    // FONCTION POUR CHARGER LES CATÉGORIES
    // ===========================
    
    const loadCategories = function () {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(categories => {
                categorySelect.innerHTML = ''; // Vide la sélection de catégories avant d'ajouter les nouvelles
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option); // Ajoute chaque catégorie au select
                });
            })
            .catch(error => console.error('Erreur lors du chargement des catégories:', error));
    };

    // ===========================
    // FONCTION DE FERMETURE DE LA MODALE
    // ===========================
    
    const closeModal = function (e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        console.log('Modale fermée');
        resetSelection();  // Réinitialise l'image sélectionnée
        if (!modal) return;

        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Ferme la modale après un délai de 300ms
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal); // Supprime l'écouteur d'événement
        modal = null;
    };

    // Empêche la propagation des clics à l'intérieur de la modale
    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    // Attache la fonction d'ouverture de modale à tous les éléments ayant la classe js-modal
    document.querySelectorAll('.js-modal').forEach(a => a.addEventListener('click', openModal));

    // Gestion de la fermeture de la modale avec la touche Escape
    window.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && modal) {
            closeModal(e);
        }
    });

    // Ferme la modale si on utilise le bouton de retour du navigateur
    window.addEventListener('popstate', function (e) {
        if (modal) {
            closeModal();
        }
    });

    // ===========================
    // GESTION DES ÉTAPES DANS LA MODALE
    // ===========================
    
    const nextStep = function () {
        console.log('Étape suivante');

        if (selectedImage) {
            uploadIcon.style.display = 'none';
            selectedImagePreview.src = selectedImage.src;
            selectedImagePreview.classList.add('selected-upload-image');
            selectedImagePreview.style.display = 'block';  // Affiche l'image sélectionnée
        }

        // Cache la galerie et affiche le formulaire d'ajout de projet
        document.getElementById('gallery-section').style.display = 'none';
        document.getElementById('new-project-section').style.display = 'block';
        document.querySelector('.back-button').style.display = 'block';
        document.getElementById('titlemodal').textContent = 'Ajout de projet';
        currentStep = 2;
    };

    const previousStep = function () {
        console.log('Retour à la galerie');
        resetSelection();  // Réinitialise l'image sélectionnée
        document.getElementById('new-project-section').style.display = 'none';
        document.getElementById('gallery-section').style.display = 'block';
        document.querySelector('.back-button').style.display = 'none';
        document.getElementById('titlemodal').textContent = 'Galerie photo';
        currentStep = 1;
    };

    const showGalleryStep = function () {
        console.log('Affichage de la galerie');
        document.getElementById('gallery-section').style.display = 'block';
        document.getElementById('new-project-section').style.display = 'none';
        document.querySelector('.back-button').style.display = 'none';
        document.getElementById('titlemodal').textContent = 'Galerie photo';
        loadGallery();  // Charge la galerie photo
    };

    const uploadButton = document.querySelector('.upload-button');
    if (uploadButton) {
        uploadButton.addEventListener('click', nextStep); // Passe à l'étape suivante lorsqu'on clique sur "Ajouter une photo"
    }

    // ===========================
    // FONCTION POUR CHARGER LA GALERIE
    // ===========================
    
    const loadGallery = function () {
        const galleryContainer = document.querySelector('.galleryModal');
        galleryContainer.innerHTML = '';  // Vide la galerie actuelle
        console.log('Chargement de la galerie');

        // Récupère les photos via l'API et les ajoute à la galerie
        fetch('http://localhost:5678/api/works')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                return response.json();
            })
            .then(photos => {
                photos.forEach(photo => {
                    addProjectToGallery(photo);  // Ajoute chaque projet à la galerie
                });
            })
            .catch(error => console.error('Erreur lors du chargement des photos:', error));
    };

    // ===========================
    // FONCTION POUR AJOUTER UN PROJET DANS LA GALERIE
    // ===========================
    const addProjectToGallery = function (photo) {
        const galleryContainer = document.querySelector('.galleryModal');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
                    
        img.src = photo.imageUrl;
        img.alt = photo.title;
        figure.appendChild(img);

        // Ajoute une fonctionnalité de sélection d'image
        img.addEventListener('click', function () {
            if (selectedImage) {
                selectedImage.classList.remove('selected'); // Retire la sélection précédente
            }
            img.classList.add('selected'); // Marque l'image comme sélectionnée
            selectedImage = img; // Stocke l'image sélectionnée
            console.log('Image sélectionnée : ', img.src);
        });

        // Ajoute un bouton pour supprimer le projet
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-icon');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    
        deleteButton.addEventListener('click', async () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                await deleteWork(photo.id); 
                figure.remove();  // Supprime l'élément du DOM après suppression
                console.log('Projet supprimé : ', photo.id);
            }
        });

        figure.appendChild(deleteButton);

        // Ajout du projet à la galerie modale et à la galerie principale
        galleryContainer.appendChild(figure);

        const galleryMain = document.querySelector('.gallery');
        const figureMain = document.createElement('figure');
        const imgMain = document.createElement('img');
        imgMain.src = photo.imageUrl;
        imgMain.alt = photo.title;
        figureMain.appendChild(imgMain);
        galleryMain.appendChild(figureMain);
    };

    // ===========================
    // SUPPRESSION DES TRAVAUX
    // ===========================
    
    async function deleteWork(id) {
        const token = localStorage.getItem('token');  // Récupère le token d'authentification
        
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Inclut le token pour authentification
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du projet');
            }

            console.log('Projet supprimé avec succès : ', id);
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // ===========================
    // AJOUT DE NOUVEAUX PROJETS
    // ===========================
    
    const addProjectForm = document.getElementById('add-photo-form');
    
    addProjectForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Empêche la soumission par défaut du formulaire

        const titleInput = document.getElementById('title-input').value.trim(); // Récupère le titre
        const categoryInput = document.getElementById('category-select').value; // Récupère l'ID de la catégorie sélectionnée
        const fileInput = document.querySelector('#add-photo-form input[type="file"]'); // Récupère le fichier sélectionné

        if (!titleInput || !categoryInput || !fileInput.files.length) {
            alert("Veuillez remplir tous les champs et ajouter une image."); // Vérifie que tous les champs sont remplis
            return;
        }

        const formData = new FormData(); // Utilise FormData pour envoyer les données
        formData.append('title', titleInput);
        formData.append('category', categoryInput);
        formData.append('image', fileInput.files[0]);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Ajoute le token dans les en-têtes de la requête
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du projet');
            }

            const newProject = await response.json();
            console.log('Projet ajouté avec succès');

            // Ajouter dynamiquement le nouveau projet dans la galerie
            addProjectToGallery(newProject);

        } catch (error) {
            console.error('Erreur:', error);
        }
    });

    // ===========================
    // RÉINITIALISATION DE LA SÉLECTION
    // ===========================
    
    const resetSelection = function () {
        if (selectedImage) {
            selectedImage.classList.remove('selected'); // Retire la sélection
        }
        selectedImage = null;  // Réinitialise la variable
        const uploadIcon = document.querySelector('.upload-icon');
        const selectedImagePreview = document.querySelector('.selected-upload-image');
        
        if (uploadIcon) {
            uploadIcon.style.display = 'block';  // Réaffiche l'icône d'upload
        }

        if (selectedImagePreview) {
            selectedImagePreview.remove();  // Supprime l'aperçu de l'image sélectionnée
        }
    };

});









































































