const openMenu = document.querySelector(".openMenu");
const nav = document.querySelector("header nav");
const closeBtn = document.querySelector(".closeBtn");


openMenu.addEventListener('click', function () {
    closeBtn.textContent = "×";
    nav.classList.toggle("active");
    document.querySelector("body").classList.toggle('menu-open');
    document.querySelector("header").classList.toggle('menu-open');
});


closeBtn.addEventListener("click", function () {
    closeBtn.textContent = "";
    nav.classList.toggle("active");
    document.querySelector("body").classList.toggle('menu-open');
    document.querySelector("header").classList.toggle('menu-open');
});

// modal ruta
const modal = document.querySelector('.modal-overlay');
const openButtons = document.querySelectorAll('.btn--book');
const closeButton = document.querySelector('.modal-close');

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
});

closeButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});
