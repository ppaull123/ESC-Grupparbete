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

// ====== ON-SITE CHALLENGES ====== //

const onsiteChallenges = [
  {
    title: "Title of room (on-site)",
    description:
      "Praeterea, ex culpa non invenies unum aut non accusatis unum. Et nihil inuitam. Nemo nocere tibi erit, et non inimicos, et.",
    participants: "2-6 participants",
    rating: 4.5,
    imageUrl: "./src/ESC-Teambuild.jpg",
  },
  {
    title: "Title of room (on-site)",
    description:
      "Tollere odium autem in nostra potestate sint, ab omnibus et contra naturam transferre in nobis. Sed interim toto.",
    participants: "2-6 participants",
    rating: 4.5,
    imageUrl: "./src/ESC-Teambuild2.jpg",
  },
];

function createStars(rating) {
  const fullStar = "<span class='rating-star'><img src='./src/checkedRatingStar.png'></span>";
  const emptyStar = "<span class='rating-star-unchecked'><img src='./src/unceckedRatingStar.png'></span>";
  const halfStar = "<span class='rating-star'><img src='./src/halfRatingStar.png'></span>";

  let stars = "";
  const fullStarsCount = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStarsCount; i++) stars += fullStar;
  if (hasHalfStar) stars += halfStar;
  for (let i = fullStarsCount + (hasHalfStar ? 1 : 0); i < 5; i++) stars += emptyStar;

  return stars;
}

const roomsList = document.querySelector(".card-rooms ul");
roomsList.innerHTML = "";

onsiteChallenges.forEach((room) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="room-card">
      <img src="${room.imageUrl}" alt="${room.title}" class="img-room">
      <section class="card-bio">
        <p class="room-title">${room.title}</p>
        <div class="rating-container">
          <div class="rating-stars">${createStars(room.rating)}</div>
          <small class="participants">${room.participants}</small>
        </div>
        <p class="room-info">${room.description}</p>
        <div class="btn-container">
          <button class="btn btn--book">Book this room</button>
        </div>
      </section>
    </div>
  `;
  roomsList.appendChild(li);
});
