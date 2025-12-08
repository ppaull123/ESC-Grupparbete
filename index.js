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
if (seeChallenges) {
    seeChallenges.addEventListener("click", () => {
        window.location.href = "challenges.html";
    });
}

//  ONLINE BUTTONS 
const onlineBtns = document.querySelectorAll(".btn--online");
if (onlineBtns.length) {
    onlineBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Go to challenges page and set hash to #online
            window.location.href = "challenges.html#online";
        });
    });
}

//  ON-SITE BUTTONS 
const onsiteBtns = document.querySelectorAll(".btn--onSite");
if (onsiteBtns.length) {
    onsiteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Go to challenges page and set hash to #onsite
            window.location.href = "challenges.html#onsite";
        });
    });
}

//close mobilemenu when any link is clicked
const navLinks = document.querySelectorAll(".nav-menuContent a");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});

// //show/ brighten the link to the active page in the menu
const currentURL = window.location.pathname.split('/').pop();

document.querySelectorAll('nav a, footer a').forEach(link => {
    const linkURL = link.getAttribute('href');

    if (linkURL === currentURL) {
        link.classList.add('active');
    }
});
