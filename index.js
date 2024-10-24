const galerie = document.querySelector(".gallery");
const boutons = document.querySelector(".btn-container");
const boutonTous = document.querySelector(".btn-tous");
galerie.innerHTML = "";
boutonTous.addEventListener("click", (e) => {
  e.preventDefault();
  showWorks();
});
async function getWorks() {
  let data = [];
  const url = "http://localhost:5678/api/works";
  const fetcher = await fetch(url);
  const resp = await fetcher.json().then(data);
  return resp;
}
getWorks();

async function showWorks() {
  const arrayWorks = await getWorks();

  arrayWorks.forEach((work) => {
    genererWorks(work);
  });
}

function genererWorks(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;

  galerie.classList.add("gallery");
  figure.appendChild(img);
  figure.appendChild(figcaption);
  galerie.appendChild(figure);
}
async function getCategory() {
  const resp = await fetch("http://localhost:5678/api/categories");
  return await resp.json();
}

async function afficherCategoryButton() {
  const categorys = await getCategory();

  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    boutons.appendChild(btn);
  });
}
afficherCategoryButton();

async function filtrerCategory() {
  const albums = await getWorks();
  console.log(albums);

  const buttons = document.querySelectorAll(".btn-container button");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      btnId = e.target.id;
      console.log(btnId);

      galerie.innerHTML = "";

      if (btnId !== 0) {
        const filtreEls = albums.filter((album) => {
          return album.categoryId == btnId;
        });
        console.log(filtreEls);

        filtreEls.forEach((work) => {
          genererWorks(work);
        });
      }
    });
  });
}
filtrerCategory();
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const msgErreur = document.querySelector(".login p");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userEmail = email.value;
  const userPwd = password.value;

  async function loginUser() {
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          password: userPwd,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour le stockage de session
        window.sessionStorage.setItem("logged", "true");
        console.log(
          "Connexion réussie, logged:",
          window.sessionStorage.getItem("logged")
        );

        // Redirection ou rafraîchissement
        window.location.href = "./index.html"; // Changez vers la page que vous voulez
      } else {
        msgErreur.textContent =
          "Erreur de connexion : " + data.message || "Échec de la connexion";
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      msgErreur.textContent =
        "Une erreur est survenue. Veuillez réessayer plus tard.";
    }
  }

  loginUser();
});

// Code de gestion de l'affichage après connexion
const logged = window.sessionStorage.getItem("logged");
const loggout = document.querySelector("li .logout");
const btnContainer = document.querySelector(".btn-container button");
const modifierBtn = document.querySelector("h3 .modifier");

if (logged === "true") {
  loggout.textContent += "Logout";
  if (btnContainer) btnContainer.innerHTML = ""; // Assurez-vous que le bouton existe avant de le manipuler
  if (modifierBtn) modifierBtn.textContent = "Modifier";

  loggout.addEventListener("click", () => {
    window.sessionStorage.setItem("logged", "false");
    window.location.reload(); // Actualise la page après déconnexion
  });
} else {
  console.log("Utilisateur non connecté.");
}
