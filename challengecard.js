import { fetchChallenges } from "./api.js";

const allLabels = [
  "web", "coding", "linux", "electronics", "ssh", "ctf",
  "phreaking", "javascript", "bash", "hacking"
];
let wrapper;

async function loadAllChallenges(challengesToRender) {

  // 1. Hämta alla challenges från API:t
  const challenges = challengesToRender || await fetchChallenges();

  // 2. Hitta elementet i HTML där alla kort ska visas
  wrapper = document.getElementById("challengesWrapper");
  wrapper.innerHTML = "";

  // 3. Skapa en section och container som håller alla kort
  const section = document.createElement("section");
  section.classList.add("challenges");

  const container = document.createElement("div");
  container.classList.add("challenges__container");

  // 4. Kolla om vi befinner oss på "main"-sidan
  const isMainPage = wrapper?.dataset.page === "main";

  // 5. Bestäm vilka challenges som ska visas
  let challengesToShow;
  if (isMainPage) {
    // Om vi är på startsidan → visa endast topp 3 baserat på rating
    const challengesCopy = [...challenges];
    challengesCopy.sort((a, b) => b.rating - a.rating);
    challengesToShow = challengesCopy.slice(0, 3);
  } else {
    // Annars → visa alla challenges (både online & on-site)
    challengesToShow = challenges;
  }

  // 6. Skapa ett kort för varje challenge
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

    // 7. Kombinera labels från API:t med alla standardetiketter
    const combinedLabels = Array.from(new Set([...labels, ...allLabels]));

    // 8. Skapa strukturen för varje challenge-kort
    const card = document.createElement("article");
    card.classList.add("challenges__card");
    card.id = `challenge-${id}`;

    // 9. Bild
    const img = document.createElement("img");
    img.classList.add("challenges__image");
    img.src = image;
    img.alt = titleText;

    // 10. Titel
    const title = document.createElement("h3");
    title.classList.add("challenges__card-title");
    title.textContent = titleText;

    // 11. Antal deltagare
    const participants = document.createElement("p");
    participants.classList.add("challenges__participants");
    participants.textContent = `${minP}–${maxP} participants`;

    // 12. Rating-stjärnor
    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("challenges__rating");

    const starsDiv = document.createElement("div");
    starsDiv.classList.add("challenges__stars");
    starsDiv.innerHTML = renderStars(rating);
    ratingDiv.appendChild(starsDiv);

    // 13. Beskrivning
    const desc = document.createElement("p");
    desc.classList.add("challenges__description");
    desc.textContent = description;

    // 14. Etiketter (labels)
    const labelsDiv = document.createElement("div");
    labelsDiv.classList.add("challenges__labels");
    labelsDiv.style.display = "none";
    combinedLabels.forEach(label => {
      const span = document.createElement("span");
      span.classList.add("challenges__label");
      span.textContent = label;
      labelsDiv.appendChild(span);
    });

    // 15. Knapp och ikon
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
    } else {
      btn.textContent = "Book this room";
      icon.classList.add("challenges__icon__onsite");
      icon.src = "src/onsite.png";
      icon.alt = "On-site icon";
    }

    // 16. Lägg ihop allt för kortet
    btnDiv.append(btn, icon);
    card.append(img, title, participants, ratingDiv, desc, labelsDiv, btnDiv);
    container.appendChild(card);
  });

  // 17. Lägg in allt på sidan
  section.appendChild(container);
  wrapper.appendChild(section);
}

// 18. Funktion för att visa stjärnor baserat på betyg
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

// 19. Kör funktionen när sidan laddas
loadAllChallenges();

export {
  loadAllChallenges,
  wrapper
}