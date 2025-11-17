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

//Open see all challenges page
const seeChallenges = document.querySelector(".section-play-online .btn-teambuilding");
seeChallenges.addEventListener("click", () => {
    window.location.href = "challenges.html";
});

//open filter form
const challengesFilterButton = document.querySelector('.btn-challengesFilter');
const filterForm = document.querySelector('.filterForm');

challengesFilterButton.addEventListener('click', () => {
    filterForm.classList.toggle('filterForm--active');
})

// add closing button for filter form
const filterForm__closeBtn = document.querySelector('.filterForm__closeBtn');

filterForm__closeBtn.addEventListener('click', () => {
    filterForm.classList.toggle('filterForm--active');
});