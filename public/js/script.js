btn = document.getElementById('btn');
menu = document.getElementById('user-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle("active");
});