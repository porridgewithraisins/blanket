import cfa from "https://esm.sh/cf-alert";

const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector("nav");
const newProjForm = document.querySelector("#new-project-form");
const newBucketForm = document.querySelector("#new-bucket-form");
const newFileForm = document.querySelector("#new-file-form");
const newProjName = document.querySelector("#new-proj-name");
const newBucketName = document.querySelector("#new-bucket-name");
const bucketProjectId = document.querySelector("#bucket-form-project-id");
const seedPhrase = document.querySelector("#seed-phrase");
const bucketIdField = document.querySelector("#bucket-id");
const projectIdField = document.querySelector("#file-form-project-id");
const toUpload = document.querySelector("#to-upload");

newProjForm.onsubmit = async e => {
    e.preventDefault();
    const result = await jsonRequest("/", {
        name: newProjName.value,
        seed_phrase: seedPhrase.value,
    });

    cfa.message(`Created project with id ${result.id} 🎉`);
};

newBucketForm.onsubmit = async e => {
    e.preventDefault();
    const path = `/${bucketProjectId.value}`;
    const result = await jsonRequest(path, {
        name: newBucketName.value,
    });

    cfa.message(`Created bucket with id ${result.id} 🎉`);
};

newFileForm.onsubmit = async e => {
    e.preventDefault();

    const path = `/${projectIdField.value}/${bucketIdField.value}`;
    const file = toUpload.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("fileName", document.querySelector("#file-name").value);
    const { cid } = await fetch(path, { method: "POST", body: data }).then(r => r.json());
    cfa.message(`Uploaded file. You can view it at ipfs://${cid}`);
};

window.addEventListener("DOMContentLoaded", () => {
    hamburger.addEventListener("click", () => {
        if (window.getComputedStyle(nav).display === "none") nav.style.display = "flex";
        else nav.style.display = "none";
    });
});

window.addEventListener("resize", () => {
    nav.style.display = window.innerWidth / window.innerHeight > 1 ? "flex" : "none";
});

const jsonRequest = (url, data, method = "POST") => {
    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    }).then(response => response.json());
};
