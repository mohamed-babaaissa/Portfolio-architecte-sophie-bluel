document.querySelector('form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
      const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if(response.ok) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);

        // Rediriger vers la page d'accueil après la connexion
        window.location.href = 'index.html';
      } else {
        alert('E-mail ou mot de passe incorrect.');
      }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
});







