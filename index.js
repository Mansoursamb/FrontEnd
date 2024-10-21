const galerie = document.querySelector(".gallery");

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
  console.log(arrayWorks);

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
genererWorks(work);
