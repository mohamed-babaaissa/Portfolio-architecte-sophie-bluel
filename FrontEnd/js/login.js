// ===========================
// GESTION DE LA SOUMISSION DU FORMULAIRE DE CONNEXION
// ===========================

// Ajoute un événement 'submit' au formulaire de connexion
document.querySelector('form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire

  // ===========================
  // RÉCUPÉRATION DES VALEURS DU FORMULAIRE
  // ===========================

  const email = document.querySelector('#email').value;  // Récupère la valeur du champ email
  const password = document.querySelector('#password').value;  // Récupère la valeur du champ mot de passe

  // ===========================
  // ENVOI DE LA REQUÊTE DE CONNEXION À L'API
  // ===========================

  try {
      const response = await fetch('http://localhost:5678/api/users/login', { // Envoi d'une requête POST à l'API
          method: 'POST',  // Méthode HTTP POST pour envoyer les données de connexion
          headers: {
            'Content-Type': 'application/json',  // Indique que le corps de la requête est en JSON
          },
          body: JSON.stringify({email, password}),  // Convertit l'email et le mot de passe en JSON pour l'envoi
      });

      const data = await response.json();  // Récupère la réponse et la convertit en JSON

      // ===========================
      // TRAITEMENT DE LA RÉPONSE DE L'API
      // ===========================

      if(response.ok) {  // Vérifie si la requête a réussi (status HTTP 200-299)
        // Stocker le token dans le localStorage pour identifier l'utilisateur dans les futures requêtes
        localStorage.setItem('token', data.token);

        // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
        window.location.href = 'index.html';
      } else {
        // Si la réponse n'est pas ok, afficher un message d'erreur à l'utilisateur
        alert('E-mail ou mot de passe incorrect.');
      }
  } catch (error) {
    // ===========================
    // GESTION DES ERREURS DE REQUÊTE
    // ===========================

    console.error('Erreur lors de la connexion :', error);  // Affiche l'erreur dans la console pour débogage
    alert('Une erreur est survenue. Veuillez réessayer.');  // Avertit l'utilisateur qu'une erreur est survenue
  }
});








