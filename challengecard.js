let allChallenges = [];

import { fetchChallenges } from "./api.js";

export const allLabels = [
  "web", "coding", "linux", "electronics", "ssh", "ctf",
  "phreaking", "javascript", "bash", "hacking"
];
let wrapper;

async function loadAllChallenges(challengesToRender) {

  // 1. Hämta alla challenges från API:t
  const challenges = challengesToRender || await fetchChallenges();
  allChallenges = challenges;

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
    const rating = ch.rating || 0;
    const image = ch.image || "src/ESC-hacker.png";
    const labels = ch.labels || [];

    // 7. Kombinera labels från API:t med alla standardetiketter
    const combinedLabels = labels || [];

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

    btn.addEventListener("click", () => {
      // Modal öppna
      const modal = document.querySelector(".modal-overlay");

      modal.dataset.challengeId = id;

      // Titlen på rum man valt i Step 1
      const step1Title = document.querySelector('#step-1 .modal-title');
      step1Title.textContent = `Book room "${titleText}" (Step 1)`;

      // Uppdatera titeln i Step 2
      const step2Title = document.querySelector('#step-2 .modal-title');
      step2Title.textContent = `Book room "${titleText}" (Step 2)`

      modal.classList.remove("hidden");
    });

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

// Modal 
const modal = document.querySelector('.modal-overlay');
const closeButton = document.querySelector('.modal-close');


// Stäng modalen med X
closeButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});


// Step 1, 2, 3 
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const step1NextBtn = document.getElementById('step1-next');
const step2NextBtn = document.getElementById('step2-next');
const backToChallenges = document.getElementById('back-to-challenges');

// Step 1 > Step 2
step1NextBtn.addEventListener("click", async () => {

  const modal = document.querySelector(".modal-overlay");
  const challengeId = modal.dataset.challengeId;

  const dateInput = document.querySelector("#booking-date").value;
  const timeSelect = document.querySelector("#time-select");

  // Rensa ALLA gamla tider
  while (timeSelect.firstChild) {
    timeSelect.removeChild(timeSelect.firstChild);
  }

  // Kontrollera datum
  const date = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today || !dateInput) {
    alert("Please select a valid future date.");
    return;
  }

  // Formatera datum -> YYYY-MM-DD
  const formattedDate = date.toISOString().split("T")[0];

  // HÄMTA LEDIGA TIDER
  const res = await fetch(
    `https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=${formattedDate}&challenge=${challengeId}`
  );
  const data = await res.json();

  if (data.slots && data.slots.length > 0) {

    // 1. Ta bort eventuella dubletter
    const availableTimes = [...new Set(data.slots)];

    // 2. Fyll dropdown med unika tider
    availableTimes.forEach(slot => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
    });

  } else {

    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No available times on this date";
    timeSelect.appendChild(option);
  }

  const participantsSelect = document.querySelector("#participant-select");
  participantsSelect.innerHTML = "";

  const challenge = allChallenges.find(ch => ch.id == challengeId);
  const minP = challenge.minParticipants;
  const maxP = challenge.maxParticipants;

  for (let i = minP; i <= maxP; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} participants`;
    participantsSelect.appendChild(option);
  }

  // Visa Step 2
  step1.style.display = "none";
  step2.style.display = "flex";
});


// Step 2 > Step 3
step2NextBtn.addEventListener("click", async () => {

  const modal = document.querySelector(".modal-overlay");
  const challengeId = modal.dataset.challengeId;

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const date = document.querySelector("#booking-date").value;
  const time = document.querySelector("#time-select").value;
  const participants = document.querySelector("#participant-select").value;

  // Validering
  if (!name || !email || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const bookingBody = {
    challenge: Number(challengeId),
    name,
    email,
    date,
    time,
    participants: Number(participants)
  };

  // SKICKA BOKNINGEN TILL API:T
  const res = await fetch("https://lernia-sjj-assignments.vercel.app/api/booking/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingBody)
  });

  const data = await res.json();

  if (res.ok) {
    // Visa Step 3
    step2.style.display = "none";
    step3.style.display = "flex";
  } else {
    alert("Booking failed: " + data.message);
  }
});

function resetBookingModal() {
  // Rensa inputs
  document.querySelector("#booking-date").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#email").value = "";
  document.querySelector("#time-select").innerHTML = "";
  document.querySelector("#participant-select").innerHTML = "";

  // Återställ steps
  step1.style.display = "flex";
  step2.style.display = "none";
  step3.style.display = "none";

  // Stäng modalen
  modal.classList.add("hidden");
}

// Reset ruta
backToChallenges.addEventListener('click', () => {
  resetBookingModal();
});

closeButton.addEventListener('click', () => {
  resetBookingModal();
});

// 19. Kör funktionen när sidan laddas
loadAllChallenges();

export {
  loadAllChallenges,
  wrapper
}