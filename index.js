const galerie = document.querySelector(".gallery");
const boutons = document.querySelector(".btn-containerAll");
const boutonTous = document.querySelector(".btn-tous");
init();
boutonTous.addEventListener("click", (e) => {
  e.preventDefault();
  showWorks();
});
async function getWorks() {
  const url = "http://localhost:5678/api/works";
  const fetcher = await fetch(url);
  arrayWorks = await fetcher.json();
  return arrayWorks;
}
async function init() {
  galerie.innerHTML = "";
  let arrayWorks = await getWorks();

  showWorks();
  affichagePhotos();
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
  console.log(boutons);

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
const loggout = document.querySelector("a li.logout");
const btnContainer = document.querySelector(" .btn-containerAll");
const modifierBtn = document.querySelector(".modifier");
console.log(loggout, logged, btnContainer, modifierBtn);

if (logged === "true") {
  loggout.innerHTML = "Logout";
  if (btnContainer) btnContainer.style.display = "none"; // Assurez-vous que le bouton existe avant de le manipuler
  if (modifierBtn) modifierBtn.textContent = "modifier";

  loggout.addEventListener("click", () => {
    window.sessionStorage.setItem("logged", "false");
    window.location.reload(); // Actualise la page après déconnexion
  });
} else {
  console.log("Utilisateur non connecté.");
}
/*affichage modal*/
const modifBouton = document.querySelector(".modificateur");
const modalGallery = document.querySelector(".modal-gallery");
const galleryModal = document.querySelector(".gallery-modal");
const closeElement = document.querySelector(".fa-xmark");
const photosList = document.querySelector(".photo-gallery");

modifierBtn.addEventListener("click", () => {
  galleryModal.style.display = "flex";
});
closeElement.addEventListener("click", () => {
  galleryModal.style.display = "none";
});
galleryModal.addEventListener("click", (e) => {
  if (e.target.className === "gallery-modal")
    galleryModal.style.display = "none";
});
/*afficher les photos*/
async function affichagePhotos() {
  photosList.innerHTML = "";

  arrayWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const poubelle = document.createElement("i");
    poubelle.classList.add("fa-solid", "fa-trash-can");
    poubelle.id = work.id;
    img.src = work.imageUrl;
    span.appendChild(poubelle);
    figure.appendChild(span);
    figure.appendChild(img);
    photosList.appendChild(figure);
  });
  return arrayWorks;
}
affichagePhotos();
