const searchButton = document.querySelector(".nav-search-button");
const searchForm = document.querySelector("#nav-search");

searchButton?.addEventListener("click", () => {
  searchForm.classList.toggle("is-open");
  searchForm.querySelector("input")?.focus();
});
