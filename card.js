import { fetchChallenges } from "./api.js";

async function loadChallenges() {
  const challenges = await fetchChallenges(); 
  const wrapper = document.getElementById("challengesWrapper");
  wrapper.innerHTML = "";

  
  const section = document.createElement("section");
  section.classList.add("challenges");

  const container = document.createElement("div");
  container.classList.add("challenges__container");

  challenges.forEach(ch => { 
    const card = document.createElement("article");
    card.classList.add("challenges__card");
    card.id = `challenge-${ch.id}`; // 

    const img = document.createElement("img");
    img.classList.add("challenges__image");
    img.src = ch.image;
    img.alt = ch.title;

    const title = document.createElement("h3");
    title.classList.add("challenges__card-title");
    title.textContent = ch.title;

    const participants = document.createElement("p");
    participants.classList.add("challenges__participants");
    participants.textContent = `${ch.minParticipants}–${ch.maxParticipants} participants`;

    const desc = document.createElement("p");
    desc.classList.add("challenges__description");
    desc.textContent = ch.description;

    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("challenges__rating");

    const starsDiv = document.createElement("div");
    starsDiv.classList.add("challenges__stars");
    starsDiv.innerHTML = renderStars(ch.rating);

    ratingDiv.appendChild(starsDiv);

    const labelsDiv = document.createElement("div");
    labelsDiv.classList.add("challenges__labels");
    labelsDiv.style.display = "none";
    ch.labels.forEach(label => {
      const span = document.createElement("span");
      span.classList.add("challenges__label");
      span.textContent = label;
      labelsDiv.appendChild(span);
    });

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("challenges__button");

    const btn = document.createElement("button");
    btn.classList.add("challenges__btn");
    
    if (ch.type === "online") {
      btn.textContent = "Take challenge online";
    } else if (ch.type === "onsite") {
      btn.textContent = "Book this room";
    }

    const icon = document.createElement("img");

    if (ch.type === "online") {
      icon.classList.add("challenges__icon__online");
      icon.src = "src/online.png";
      icon.alt = "Online icon";
    } else if (ch.type === "onsite") {
      icon.classList.add("challenges__icon__onsite");
      icon.src = "src/onsite.png";
      icon.alt = "On-site icon";
    }

    btnDiv.appendChild(btn);
    btnDiv.appendChild(icon);

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

loadChallenges();