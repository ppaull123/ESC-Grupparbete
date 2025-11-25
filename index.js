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
//  ONLINE BUTTONS 
const onlineBtns = document.querySelectorAll(".btn--online");

onlineBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Go to challenges page and set hash to #online
        window.location.href = "challenges.html#online";
    });
});

//  ON-SITE BUTTONS 
const onsiteBtns = document.querySelectorAll(".btn--onSite");

onsiteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Go to challenges page and set hash to #onsite
        window.location.href = "challenges.html#onsite";
    });
});
