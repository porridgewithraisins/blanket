import cfa from "https://esm.sh/cf-alert";

const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector("nav");

window.addEventListener("DOMContentLoaded", () => {
  hamburger.addEventListener("click", () => {
    if (window.getComputedStyle(nav).display === "none")
      nav.style.display = "flex";
    else nav.style.display = "none";
  });
});

window.addEventListener("resize", () => {
  nav.style.display =
    window.innerWidth / window.innerHeight > 1 ? "flex" : "none";
});

const spargleRequest = (url, data, method = 'POST') => {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

const submitForm = (ids, method, url) => {
  const body = Object.fromEntries(
    ids.map((id) => [id, document.getElementById(id).value])
  );
  return spargleRequest(url, body, method);
};