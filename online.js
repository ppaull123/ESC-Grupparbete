import { fetchChallenges } from "./api.js";

const allLabels = [
  "web",
  "coding",
  "linux",
  "electronics",
  "ssh",
  "ctf",
  "phreaking",
  "javascript",
  "bash",
  "hacking"
];

async function loadAllChallenges() {
  const challenges = await fetchChallenges();
  const wrapper = document.getElementById("challengesWrapper");
  wrapper.innerHTML = "";

  const section = document.createElement("section");
  section.classList.add("challenges");

  const container = document.createElement("div");
  container.classList.add("challenges__container");

  const isMainPage = wrapper?.dataset.page === "main";

  const challengesToShow = isMainPage
    ? [...challenges].sort((a, b) => b.rating - a.rating).slice(0, 3)
    : challenges;

  challengesToShow.forEach(ch => {
    const id = ch.id || 0;
    const type = ch.type || "online";
    const titleText =
      ch.title ||
      (type === "onsite"
        ? "Title of room (on-site)"
        : "Title of room (online)");
    const description =
      ch.description ||
      "Praeterea, ex culpa non invenies unum aut non accusatis unum. Et nihil inuitam. Nemo nocere tibi erit, et non inimicos, et.";
    const minP = ch.minParticipants || 2;
    const maxP = ch.maxParticipants || 6;
    const rating = ch.rating || 4;
    const image = ch.image || "src/ESC-hacker.png";
    const labels = ch.labels || [];

    const combinedLabels = Array.from(new Set([...labels, ...allLabels]));

    const card = document.createElement("article");
    card.classList.add("challenges__card");
    card.id = `challenge-${id}`;

    const img = document.createElement("img");
    img.classList.add("challenges__image");
    img.src = image;
    img.alt = titleText;

    const title = document.createElement("h3");
    title.classList.add("challenges__card-title");
    title.textContent = titleText;

    const participants = document.createElement("p");
    participants.classList.add("challenges__participants");
    participants.textContent = `${minP}–${maxP} participants`;

    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("challenges__rating");

    const starsDiv = document.createElement("div");
    starsDiv.classList.add("challenges__stars");
    starsDiv.innerHTML = renderStars(rating);
    ratingDiv.appendChild(starsDiv);

    const desc = document.createElement("p");
    desc.classList.add("challenges__description");
    desc.textContent = description;

    const labelsDiv = document.createElement("div");
    labelsDiv.classList.add("challenges__labels");
    labelsDiv.style.display = "none";
    combinedLabels.forEach(label => {
      const span = document.createElement("span");
      span.classList.add("challenges__label");
      span.textContent = label;
      labelsDiv.appendChild(span);
    });

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("challenges__button");

    const btn = document.createElement("button");
    btn.classList.add("challenges__btn");

    const icon = document.createElement("img");

    if (type === "online") {
      btn.textContent = "Take challenge online";
      icon.classList.add("challenges__icon__online");
      icon.src = "src/online.png";
      icon.alt = "Online icon";
    } else if (type === "onsite") {
      btn.textContent = "Book this room";
      icon.classList.add("challenges__icon__onsite");
      icon.src = "src/onsite.png";
      icon.alt = "On-site icon";
    }

    btnDiv.append(btn, icon);
    card.append(img, title, participants, ratingDiv, desc, labelsDiv, btnDiv);
    container.appendChild(card);
  });

  section.appendChild(container);
  wrapper.appendChild(section);
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<span class="challenges__star challenges__star--filled"></span>';
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars += '<span class="challenges__star challenges__star--half"></span>';
    } else {
      stars += '<span class="challenges__star challenges__star--empty"></span>';
    }
  }
  return stars;
}

loadAllChallenges();
