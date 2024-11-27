const galerie = document.querySelector(".gallery");
const boutons = document.querySelector(".btn-containerAll");
const boutonTous = document.querySelector(".btn-tous");

let arrayWorks;
init();

async function getWorks() {
  const url = "http://localhost:5678/api/works";
  const fetcher = await fetch(url);
  arrayWorks = await fetcher.json();
  return arrayWorks;
}

async function init() {
  galerie.innerHTML = "";
  arrayWorks = await getWorks();
  showWorks();
  affichagePhotos();
}

async function showWorks() {
  arrayWorks.forEach((work) => {
    genererWorks(work);
  });
}

boutonTous.addEventListener("click", (e) => {
  e.preventDefault();
  init();
});

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
  const buttons = document.querySelectorAll(".btn-containerAll ");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      btnId = e.target.id;
      galerie.innerHTML = "";
      if (btnId !== 0) {
        const filtreEls = arrayWorks.filter((album) => {
          return album.category.id == btnId;
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
const penItem = document.querySelector(".modificateur .fa-pen-to-square");
const divEdit = document.querySelector(".edit");
const span = document.querySelector(".edit span");

if (logged === "true") {
  loggout.innerHTML = "Logout";
  if (btnContainer) btnContainer.style.display = "none"; // Assurez-vous que le bouton existe avant de le manipuler
  if (modifierBtn) modifierBtn.textContent = "modifier";
  penItem.style.display = "flex";
  divEdit.style.display = "flex";
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

span.textContent = span.textContent.toLowerCase();

divEdit.addEventListener("click", () => {
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
  if (arrayWorks && arrayWorks.length > 0) {
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
    deleteWork();
    return arrayWorks;
  }
}

function deleteWork() {
  const discardEls = document.querySelectorAll(".fa-trash-can");

  discardEls.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const workId = e.target.id; // Récupère l'ID de l'élément à supprimer
      const token = localStorage.getItem("token"); // Récupérer le token de localStorage

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Ajouter le token à l'en-tête
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Suppression réussie : mettez à jour l'affichage
          e.target.closest("figure").remove();
          arrayWorks = arrayWorks.filter((id) => {
            return id !== workId;
          });
          init();
          console.log(`Work avec ID ${workId} supprimé.`);
        } else {
          console.error(
            `Erreur lors de la suppression du work avec ID ${workId}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de la requête DELETE :", error);
      }
    });
  });
}

// faire apparaiter une deuxieme modale

const augmenteBtn = document.querySelector(".augmenter");
let addWorkModal = document.querySelector(".addWorkModal");
const backEl = document.querySelector(".fa-arrow-left");
const closeEl = document.querySelector(".addWorkModal .fa-xmark");

augmenteBtn.addEventListener("click", () => {
  galleryModal.style.display = "none";
  addWorkModal.style.display = "flex";
});

backEl.addEventListener("click", () => {
  galleryModal.style.display = "flex";
  addWorkModal.style.display = "none";
});

closeEl.addEventListener("click", () => {
  galleryModal.style.display = "none";
  addWorkModal.style.display = "none";
});

// previsualisation image sur input file
let previewImg = document.querySelector(".containerFile img");
const inputFile = document.querySelector(".containerFile input");
const labelFile = document.querySelector(".containerFile label");
const inconFile = document.querySelector(".containerFile .fa-image ");
const pFile = document.querySelector(".containerFile p");

// ecouter les changements sur l input

inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      inconFile.style.display = "none";
      pFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});
// recuperer les option categories ***creer liste option pour select

async function displayOptions() {
  const select = document.querySelector(".ajout select");
  const categorys = await getCategory();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
displayOptions();

// Faire un post ajouter une photo

async function addWork() {
  // Vérifie la validité du token
  const isValid = await checkTokenValidity();
  if (!isValid) {
    alert("Votre session a expiré, veuillez vous reconnecter.");
    return;
  }

  // Sélection des champs
  const form = document.querySelector(".addWorkModal form");
  const title = document.querySelector(".ajout #title").value.trim();
  const category = document.querySelector(".ajout #category").value;
  const imageInput = document.querySelector(".containerFile #file");
  const token = localStorage.getItem("token");

  // Vérification des champs
  if (!imageInput.files || !imageInput.files[0]) {
    alert("Aucune image sélectionnée.");
    return;
  }
  if (!title) {
    alert("Veuillez saisir un titre.");
    return;
  }

  // Préparation des données pour l'API
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", imageInput.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token
      },
    });

    if (response.ok) {
      const data = await response.json();
      init(); // Actualise l'affichage des photos
      reInit(); // Réinitialise le formulaire
    } else {
      const errorData = await response.json();
      console.error(
        "Erreur lors de l'ajout de la photo :",
        errorData.message || response.statusText
      );
    }
  } catch (error) {
    console.error("Erreur lors de la requête POST :", error);
  }
}

// Écouteur d'événement pour la soumission du formulaire
document.querySelector(".addWorkModal form").addEventListener("submit", (e) => {
  e.preventDefault();
  addWork(); // Ajout de la photo
});

function reInit() {
  const titleInput = document.querySelector(".ajout #title");
  const categoryInput = document.querySelector(".ajout #category");
  const previewImg = document.querySelector(".containerFile img");
  const labelFile = document.querySelector(".containerFile label");
  const inconFile = document.querySelector(".containerFile .fa-image");
  const pFile = document.querySelector(".containerFile p");

  // Réinitialiser les champs
  titleInput.value = "";
  categoryInput.value = "";
  resetFileInput(); // Réinitialise le champ fichier

  // Réinitialiser l'aperçu de l'image et ses éléments
  if (previewImg) {
    previewImg.style.display = "none";
    previewImg.src = "";
  }
  if (labelFile) labelFile.style.display = "flex";
  if (inconFile) inconFile.style.display = "flex";
  if (pFile) pFile.style.display = "flex";

  // Fermer la modale
  const addWorkModal = document.querySelector(".addWorkModal");
  if (addWorkModal) {
    addWorkModal.style.display = "none";
  }
}

function resetFileInput() {
  const fileInput = document.querySelector(".containerFile #file");
  const parent = fileInput.parentElement;

  // Crée un nouvel élément input
  const newFileInput = document.createElement("input");
  newFileInput.type = "file";
  newFileInput.id = fileInput.id;
  newFileInput.name = fileInput.name;
  newFileInput.className = fileInput.className; // Copie les classes

  // Ajoute l'événement `change` pour la prévisualisation
  newFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const previewImg = document.querySelector(".containerFile img");
    const labelFile = document.querySelector(".containerFile label");
    const inconFile = document.querySelector(".containerFile .fa-image");
    const pFile = document.querySelector(".containerFile p");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (previewImg) {
          previewImg.src = event.target.result;
          previewImg.style.display = "flex";
        }
        if (labelFile) labelFile.style.display = "none";
        if (inconFile) inconFile.style.display = "none";
        if (pFile) pFile.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Remplace l'ancien input
  parent.replaceChild(newFileInput, fileInput);

  console.log("Champ fichier réinitialisé et événement réattaché.");
}

// check token validity
async function checkTokenValidity() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Aucun token trouvé.");
    return false;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Token valide.");
      return true;
    } else {
      console.error("Token invalide ou expiré.");
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return false;
  }
}

// Appel de la fonction pour vérifier le token
checkTokenValidity();
