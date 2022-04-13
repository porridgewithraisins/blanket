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
const viewBucketProjectDropdown = document.querySelector('#view-bucket-project-dropdown');
const viewBucketBucketDropdown = document.querySelector('#view-bucket-bucket-dropdown');
const viewBucketForm = document.querySelector('#view-bucket-form');

web3signIn.addEventListener("click", async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const addrElem = document.getElementById("eth-address");
    addrElem.innerHTML = address.slice(0, 7) + "..." + address.slice(address.length - 3);
    addrElem.title = address;

    web3signIn.innerHTML = 'Signed In';
});

newProjForm.onsubmit = async e => {
    e.preventDefault();
    const result = await jsonRequest("/api/projects", {
        name: newProjName.value,
        seed_phrase: seedPhrase.value,
    });

    await cfa.message(`Created project with id ${result.id} 🎉`);
    window.location.reload();
};

newBucketForm.onsubmit = async e => {
    e.preventDefault();
    const path = `/api/projects/${bucketProjectId.value}/buckets`;
    const result = await jsonRequest(path, {
        name: newBucketName.value,
    });

    await cfa.message(`Created bucket with id ${result.id} 🎉`);
    window.location.reload();
};

toUpload.onchange = () => {
    const label = document.querySelector('label[for="to-upload"]');
    if (toUpload.files[0]) {
        label.innerHTML = `Selected: ${toUpload.files[0].name}`;
        label.classList.add('has-file');
    }
    else {
        label.innerHTML = "Choose a file";
        label.classList.remove('has-file');
    }
}

newFileForm.onsubmit = async e => {
    e.preventDefault();
    const path = `/api/projects/${projectIdField.value}/buckets/${bucketIdField.value}`;
    const file = toUpload.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("fileName", document.querySelector("#file-name").value);
    const { cid } = await fetch(path, { method: "POST", body: data }).then(r => r.json());
    await cfa.message(`Uploaded file. You can view it at ipfs://${cid}`);
    window.location.reload();
};

projectIdField.onchange = async () => {
    const buckets = await jsonRequest(`/api/projects/${projectIdField.value}/buckets`, {}, 'GET');
    buckets.forEach((bucket) => createOption(bucket.name, bucketIdField, bucket.id));
}

const createOption = (name, dropdown, value) => {
    const opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = value;
    dropdown.appendChild(opt);
    return opt;
}

const loadProjects = async () => {
    const projects = await jsonRequest('/api/projects', {}, 'GET');
    const pList = document.querySelector('#project-list');
    pList.innerHTML = '';
    projects.forEach((proj) => {
        const elem = document.createElement('li');
        elem.innerHTML = `<b>${proj.name}</b> (ID: ${proj.id})`;
        createOption(proj.name, bucketProjectId, proj.id);
        createOption(proj.name, projectIdField, proj.id);
        createOption(proj.name, viewBucketProjectDropdown, proj.id);
        pList.appendChild(elem);
    })
}

viewBucketProjectDropdown.onchange = async () => {
    const buckets = await jsonRequest(`/api/projects/${viewBucketProjectDropdown.value}/buckets`, {}, 'GET');
    buckets.forEach((bucket) => createOption(bucket.name, viewBucketBucketDropdown, bucket.id))
}

viewBucketForm.onsubmit = async (e) => {
    e.preventDefault();
    const files = (await jsonRequest(`/api/projects/${viewBucketProjectDropdown.value}/buckets/${viewBucketBucketDropdown.value}`, {}, "GET")).files;
    console.log(files);
    const bucketContents = document.querySelector('#bucket-contents');
    bucketContents.innerHTML = '';
    files.forEach((file) => {
        const elem = document.createElement('li');
        elem.innerHTML = `<b>${file.name}</b> (ID: ${file.id}) <a href="https://ipfs.io/ipfs/${file.cid}/">View</a>`;
        bucketContents.appendChild(elem);
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
