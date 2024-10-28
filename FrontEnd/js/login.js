// ===========================
// GESTION DE LA SOUMISSION DU FORMULAIRE DE CONNEXION
// ===========================

// Ajoute un événement de soumission au formulaire pour gérer la connexion de l'utilisateur
document.querySelector('form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Empêche le rechargement de la page à la soumission du formulaire

  // Récupère les valeurs des champs de saisie pour l'email et le mot de passe
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
      // Envoie une requête POST à l'API de connexion avec les données de connexion
      const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',  // Spécifie que les données envoyées sont en JSON
          },
          body: JSON.stringify({ email, password }),  // Convertit l'email et le mot de passe en JSON pour l'envoi
      });

      // Convertit la réponse en objet JSON pour accéder aux données
      const data = await response.json();

      // Vérifie si la réponse est positive (status HTTP entre 200 et 299)
      if (response.ok) {
          const token = data.token;  // Extrait le token de la réponse

          // Vérifie si le token est valide et non vide avant de l'enregistrer
          if (token) {
              // Enregistre le token dans le localStorage pour identifier l'utilisateur
              localStorage.setItem('token', token);

              // Calcule le temps d'expiration du token (ici, une heure après la connexion)
              const expirationTime = Date.now() + 60 * 60 * 1000;  // Ajoute une heure en millisecondes
              localStorage.setItem('tokenExpiration', expirationTime);

              // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
              window.location.href = 'index.html';
          } else {
              // Message d'alerte en cas de token invalide ou absent dans la réponse
              alert("Erreur: Token non valide.");
          }
      } else {
          // Affiche un message d'erreur si les identifiants sont incorrects
          alert('E-mail ou mot de passe incorrect.');
      }
  } catch (error) {
      // Affiche l'erreur dans la console pour faciliter le débogage
      console.error('Erreur lors de la connexion :', error);
      
      // Avertit l'utilisateur qu'une erreur s'est produite lors de la tentative de connexion
      alert('Une erreur est survenue. Veuillez réessayer.');
  }
});











