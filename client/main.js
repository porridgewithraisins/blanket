import cfa from "https://esm.sh/cf-alert";
import { ethers } from "https://esm.sh/ethers";

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
const web3signIn = document.querySelector("#web3-sign-in");

web3signIn.addEventListener("click", async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("eth-address").innerHTML = address;
});

newProjForm.onsubmit = async e => {
    e.preventDefault();
    const result = await jsonRequest("/api/projects", {
        name: newProjName.value,
        seed_phrase: seedPhrase.value,
    });

    await cfa.message(`Created project with id ${result.id} 🎉`);
};

newBucketForm.onsubmit = async e => {
    e.preventDefault();
    const path = `/api/projects/${bucketProjectId.value}/buckets`;
    const result = await jsonRequest(path, {
        name: newBucketName.value,
    });

    cfa.message(`Created bucket with id ${result.id} 🎉`);
};

newFileForm.onsubmit = async e => {
    e.preventDefault();

    const path = `/api/projects/${projectIdField.value}/buckets/${bucketIdField.value}`;
    const file = toUpload.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("fileName", document.querySelector("#file-name").value);
    const { cid } = await fetch(path, { method: "POST", body: data }).then(r => r.json());
    cfa.message(`Uploaded file. You can view it at ipfs://${cid}`);
};

projectIdField.onchange = async () => {
    const buckets = await jsonRequest(`/api/projects/${projectIdField.value}/buckets`, {}, 'GET');
    buckets.forEach((bucket) => {
        const elem = document.createElement('option');
        elem.innerHTML = bucket.name;
        elem.value = bucket.id;
        bucketIdField.appendChild(elem);
    })
}

const loadProjects = async () => {
    const projects = await jsonRequest('/api/projects', {}, 'GET');
    const pList = document.querySelector('#project-list');
    pList.innerHTML = '';
    projects.forEach((proj) => {
        const elem = document.createElement('li');
        elem.innerHTML = `
        <h3>${proj.name}</h3>
        <ul>
            <li>ID: ${proj.id}</li>
        </ul>
        `;
        const opt = document.createElement('option');
        opt.text = proj.name;
        opt.value = proj.id;
        const opt1 = document.createElement('option');
        opt1.text = proj.name;
        opt1.value = proj.id;
        bucketProjectId.appendChild(opt1);
        projectIdField.appendChild(opt);
        pList.appendChild(elem);
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    hamburger.addEventListener("click", () => {
        if (window.getComputedStyle(nav).display === "none") nav.style.display = "flex";
        else nav.style.display = "none";
    });

    loadProjects();
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
        body: method === 'HEAD' || method === 'GET' ? undefined : JSON.stringify(data),
    }).then(response => response.json());
};
