document.addEventListener('DOMContentLoaded', function () {
    let modal = null; // Variable pour stocker la modale active

    // Fonction pour ouvrir la modale
    const openModal = function (e) {
        e.preventDefault();
        
        // Récupération de la modale via l'attribut href de l'élément déclencheur
        modal = document.querySelector(e.target.getAttribute('href'));

        if (!modal) {
            console.error('Modale non trouvée');
            return;
        }

        // Gérer l'historique : Ajoute une nouvelle entrée dans l'historique sans recharger la page
        history.pushState({ modalOpen: true }, null, window.location.href);

        // Afficher la modale
        modal.style.display = 'block';
        modal.style.pointerEvents = 'auto';

        // Appliquer un délai pour animer l'apparition de la modale
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        // Gestion des attributs d'accessibilité
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');

        // Empêche la fermeture si l'utilisateur clique à l'intérieur de la modale
        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) {
            stopElement.addEventListener('click', stopPropagation);
        }

        // Ajoute l'événement de fermeture de la modale au clic extérieur ou sur la croix
        modal.addEventListener('click', closeModal);

        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Gère le bouton retour en arrière (optionnel)
        const backButton = modal.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                window.history.back(); // Revenir à la page précédente
            });
        }
    };

    // Fonction pour fermer la modale
    const closeModal = function (e) {
        // Vérifie si un événement est passé avant d'utiliser preventDefault
        if (e && e.preventDefault) {
            e.preventDefault(); // Empêche le comportement par défaut (si l'événement est fourni)
        }

        // Si aucune modale n'est ouverte, on quitte la fonction
        if (!modal) return;

        // Animation pour masquer la modale
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';

        // Cache la modale après un délai pour permettre l'animation
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'none';
            }
        }, 300);

        // Met à jour les attributs d'accessibilité
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');

        // Nettoie les événements associés à la modale
        modal.removeEventListener('click', closeModal);

        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) {
            closeButton.removeEventListener('click', closeModal);
        }

        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) {
            stopElement.removeEventListener('click', stopPropagation);
        }

        // Réinitialise la variable modale
        modal = null;
    };

    // Empêche la propagation des événements de clic à l'extérieur de la modale
    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    // Attache l'événement d'ouverture de modale à tous les éléments ayant la classe 'js-modal'
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    // Gère la fermeture de la modale avec la touche 'Escape'
    window.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && modal) {
            closeModal(e);
        }
    });

    // Gère le retour en arrière (popstate) pour fermer la modale si elle est ouverte
    window.addEventListener('popstate', function (e) {
        if (modal) {
            closeModal(); // Ferme la modale si l'utilisateur utilise le bouton retour
        }
    });
});




















































