document.addEventListener('DOMContentLoaded', function () {
    let modal = null; // Variable pour stocker la modale active

    // ===========================
    // FONCTION D'OUVERTURE DE LA MODALE
    // ===========================

    const openModal = function (e) {
        e.preventDefault(); // Empêche le comportement par défaut du lien cliqué
        
        // Récupération de la modale via l'attribut href de l'élément déclencheur
        modal = document.querySelector(e.target.getAttribute('href'));

        if (!modal) {
            console.error('Modale non trouvée');
            return; // Arrête la fonction si la modale n'est pas trouvée
        }

        // Gérer l'historique : Ajoute une nouvelle entrée dans l'historique sans recharger la page
        history.pushState({ modalOpen: true }, null, window.location.href);

        // Afficher la modale
        modal.style.display = 'block';  // Montre la modale
        modal.style.pointerEvents = 'auto';  // Permet l'interaction avec la modale

        // Applique un délai pour l'animation d'apparition
        setTimeout(() => {
            modal.style.opacity = '1'; // Fait apparaître la modale progressivement
        }, 10);

        // Gestion des attributs d'accessibilité
        modal.removeAttribute('aria-hidden'); // Indique que la modale est visible pour les lecteurs d'écran
        modal.setAttribute('aria-modal', 'true'); // Indique que c'est une modale active

        // Empêche la fermeture si l'utilisateur clique à l'intérieur de la modale
        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) {
            stopElement.addEventListener('click', stopPropagation); // Empêche la propagation du clic en dehors de la modale
        }

        // Ajoute l'événement de fermeture de la modale au clic extérieur ou sur la croix
        modal.addEventListener('click', closeModal);

        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal); // Ferme la modale quand on clique sur la croix
        }

        // Gère le bouton retour en arrière pour revenir à la page précédente
        const backButton = modal.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                window.history.back(); // Revenir à la page précédente dans l'historique du navigateur
            });
        }
    };

    // ===========================
    // FONCTION DE FERMETURE DE LA MODALE
    // ===========================

    const closeModal = function (e) {
        // Vérifie si un événement est passé avant d'utiliser preventDefault
        if (e && e.preventDefault) {
            e.preventDefault(); // Empêche le comportement par défaut (si l'événement est fourni)
        }

        // Si aucune modale n'est ouverte, quitter la fonction
        if (!modal) return;

        // Animation pour masquer la modale
        modal.style.opacity = '0';  // Masque la modale progressivement
        modal.style.pointerEvents = 'none'; // Désactive les interactions avec la modale

        // Cache la modale après un délai pour permettre l'animation
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'none'; // Masque complètement la modale après l'animation
            }
        }, 300);

        // Met à jour les attributs d'accessibilité
        modal.setAttribute('aria-hidden', 'true'); // Rend la modale invisible pour les lecteurs d'écran
        modal.removeAttribute('aria-modal'); // Retire l'attribut modal car la modale est fermée

        // Nettoie les événements associés à la modale pour éviter les fuites de mémoire
        modal.removeEventListener('click', closeModal);

        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) {
            closeButton.removeEventListener('click', closeModal);
        }

        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) {
            stopElement.removeEventListener('click', stopPropagation);
        }

        // Réinitialise la variable modale à null
        modal = null;
    };

    // ===========================
    // FONCTION POUR EMPÊCHER LA PROPAGATION DU CLIC DANS LA MODALE
    // ===========================

    const stopPropagation = function (e) {
        e.stopPropagation(); // Empêche la propagation du clic à l'extérieur de la modale
    };

    // ===========================
    // AJOUT D'ÉVÉNEMENTS AUX MODALES
    // ===========================

    // Attache l'événement d'ouverture de modale à tous les éléments ayant la classe 'js-modal'
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal); // Ouvre la modale au clic
    });

    // Gère la fermeture de la modale avec la touche 'Escape'
    window.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && modal) {
            closeModal(e); // Ferme la modale si la touche Échappe est pressée
        }
    });

    // Gère le retour en arrière (popstate) pour fermer la modale si elle est ouverte
    window.addEventListener('popstate', function (e) {
        if (modal) {
            closeModal(); // Ferme la modale si l'utilisateur utilise le bouton retour du navigateur
        }
    });
});





















































