const galerie = document.querySelector(".gallery");
const boutons = document.querySelector(".btn-container");
const boutonTous = document.querySelector(".btn-tous");

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
showWorks();
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
  console.log(categorys);

  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    boutons.appendChild(btn);
  });
}
afficherCategoryButton();
