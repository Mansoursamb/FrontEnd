const galerie = document.querySelector(".gallery");

async function getWorks() {
  let data = [];
  const url = "http://localhost:5678/api/works";
  const fetcher = await fetch(url);
  const resp = await fetcher.json().then(data);
  console.log(resp);
}
getWorks();
