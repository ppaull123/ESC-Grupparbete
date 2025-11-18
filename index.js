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

//Open "see all challenges" page
const seeChallenges = document.querySelector(".section-play-online .btn-teambuilding");
seeChallenges.addEventListener("click", () => {
    window.location.href = "challenges.html";
});

// Modal functionality
const modal = document.querySelector('.modal-overlay');
const closeButton = document.querySelector('.modal-close');


// Stäng modalen med X
closeButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Stäng om man klickar outside
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});

// Step 1, 2, 3 
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const step1NextBtn = document.getElementById('step1-next');
const step2NextBtn = document.getElementById('step2-next');
const backToChallenges = document.getElementById('back-to-challenges');

// Step 1 > Step 2
step1NextBtn.addEventListener('click', () => {
    step1.style.display = 'none';
    step2.style.display = 'flex';
});

// Step 2 > Step 3
step2NextBtn.addEventListener('click', () => {
    step2.style.display = 'none';
    step3.style.display = 'flex';
});

// Reset modal
backToChallenges.addEventListener('click', () => {
    modal.classList.add('hidden');
    step1.style.display = 'flex';
    step2.style.display = 'none';
    step3.style.display = 'none';
});