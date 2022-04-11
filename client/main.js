const hamburger = document.querySelector("#hamburger");
const nav = document.querySelector('nav');

window.addEventListener('DOMContentLoaded', () => {
    hamburger.addEventListener('click', () => {
        if (window.getComputedStyle(nav).display === 'none') nav.style.display = 'flex';
        else nav.style.display = 'none';
    });
});

window.addEventListener('resize', () => {
    nav.style.display = window.innerWidth / window.innerHeight > 1 ? 'flex' : 'none';
})