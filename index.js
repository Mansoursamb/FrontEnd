const galerie = document.querySelector(".gallery");
const boutons = document.querySelector(".btn-container");
const boutonTous = document.querySelector(".btn-tous");
galerie.innerHTML = "";
let arrayWorks = [];
getWorks();

boutonTous.addEventListener("click", (e) => {
  e.preventDefault();
  showWorks();
});
async function getWorks() {
  const url = "http://localhost:5678/api/works";
  const fetcher = await fetch(url);
  arrayWorks = await fetcher.json();

  showWorks();
}

async function showWorks() {
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
  const buttons = document.querySelectorAll(".btn-container button");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      btnId = e.target.id;
      console.log(btnId);

      galerie.innerHTML = "";
      console.log(arrayWorks);

      if (btnId !== 0) {
        const filtreEls = arrayWorks.filter((album) => {
          return album.categoryId == btnId;
        });

        filtreEls.forEach((work) => {
          genererWorks(work);
        });
      } else {
        arrayWorks.forEach((work) => {
          genererWorks(work);
        });
      }
    });
  });
}
filtrerCategory();

// Code de gestion de l'affichage après connexion
const logged = window.sessionStorage.getItem("logged");
const loggout = document.querySelector("li.logout");
const btnContainer = document.querySelector(" .btn-containerAll");
const modifierBtn = document.querySelector(".modifier");
console.log(logged, loggout, btnContainer, modifierBtn);
if (logged === "true") {
  loggout.innerHTML = "Logout";
  if (btnContainer) btnContainer.innerHTML = ""; // Assurez-vous que le bouton existe avant de le manipuler
  if (modifierBtn) modifierBtn.textContent = "Modifier";

  loggout.addEventListener("click", () => {
    window.sessionStorage.setItem("logged", "true");
    window.location.reload(); // Actualise la page après déconnexion
  });
} else {
  console.log("Utilisateur non connecté.");
}
