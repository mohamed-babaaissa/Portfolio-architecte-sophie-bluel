document.addEventListener('DOMContentLoaded', function () {
    let modal = null;
    let focusables = [];
    let previouslyFocusedElement = null;

    const focusableSelector = 'button, a, input, textarea';

    // Ouvrir la modale
    const openModal = function (e) {
        e.preventDefault();
        modal = document.querySelector(e.target.getAttribute('href'));

        if (!modal) {
            console.error('Modale non trouvée');
            return;
        }

        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');

        focusables = Array.from(modal.querySelectorAll(focusableSelector));
        previouslyFocusedElement = document.querySelector(':focus');
        focusables[0].focus();

        // Bloque la fermeture si on clique à l'intérieur de la modale
        const stopElement = modal.querySelector('.js-modal-stop');
        if (stopElement) {
            stopElement.addEventListener('click', stopPropagation);
        }

        // Fermer la modale via la croix ou en cliquant à l'extérieur
        modal.addEventListener('click', closeModal);

        const closeButton = modal.querySelector('.js-modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Gestion du bouton retour en arrière
        const backButton = modal.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function() {
                window.history.back(); // Revenir à la page précédente
            });
        }
    };

    // Fermer la modale
    const closeModal = function (e) {
        // Vérifie si le clic est en dehors de la modale ou sur la croix
        if (!modal) return;
        if (!e.target.closest('.modal-wrapper') || e.target.classList.contains('js-modal-close')) {
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }

            e.preventDefault();
            modal.style.opacity = '0';
            setTimeout(() => {
                if (modal) {
                    modal.style.display = 'none';
                }
            }, 300);

            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');

            modal.removeEventListener('click', closeModal);
            const closeButton = modal.querySelector('.js-modal-close');
            if (closeButton) {
                closeButton.removeEventListener('click', closeModal);
            }

            const stopElement = modal.querySelector('.js-modal-stop');
            if (stopElement) {
                stopElement.removeEventListener('click', stopPropagation);
            }
            modal = null;
        }
    };

    const stopPropagation = function (e) {
        e.stopPropagation();  
    };

    // Ajouter des événements pour tous les éléments qui ouvrent la modale
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    // Gestion de la fermeture de la modale avec la touche Escape
    window.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && modal) {
            closeModal(e);
        }
    });
});






















