import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges, allLabels } from "./challengecard.js";

document.addEventListener("DOMContentLoaded", () => {
    initFilter();
});

function initFilter() {
    // allLabels kan vara tom vid första körningen → vänta
    if (!allLabels || allLabels.length === 0) {
        setTimeout(initFilter, 50);
        return;
    }

    setupElements();
    setupTagFilter();
    setupListeners();
}

// GRUND-ELEMENT
let onlineCheckbox;
let onsiteCheckbox;
let minRatingInputs;
let maxRatingInputs;
let keywordInput;
let noMatchesInfo;
let tagFilterList;

let selectedTags = [];

function setupElements() {
    onlineCheckbox = document.querySelector('#online_challenges');
    onsiteCheckbox = document.querySelector('#on-site_challenges');
    minRatingInputs = Array.from(document.querySelectorAll('input[name="minRating"]'));
    maxRatingInputs = Array.from(document.querySelectorAll('input[name="maxRating"]'));
    keywordInput = document.querySelector('.keywordFilter__input');
    noMatchesInfo = document.querySelector('.filterForm__info');
    tagFilterList = document.querySelector(".tagFilter__list");
}

// TAGGAR
function setupTagFilter() {
    tagFilterList.innerHTML = "";

    allLabels.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = tag;
        li.classList.add("tagFilter__item");

        li.addEventListener("click", () => {
            toggleTag(tag, li);
            filterAllChallenges();
        });

        tagFilterList.appendChild(li);
    });
}

function toggleTag(tag, element) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        element.classList.remove("tagFilter__item--selected");
    } else {
        selectedTags.push(tag);
        element.classList.add("tagFilter__item--selected");
    }
}

// EVENT LISTENERS
function setupListeners() {
    onlineCheckbox.addEventListener('change', filterAllChallenges);
    onsiteCheckbox.addEventListener('change', filterAllChallenges);

    keywordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterAllChallenges();
        }
    });

    minRatingInputs.forEach(input =>
        input.addEventListener('change', filterAllChallenges)
    );

    maxRatingInputs.forEach(input =>
        input.addEventListener('change', filterAllChallenges)
    );
}

// ALLA FILTER-FUNKTIONER
async function filterAllChallenges() {
    let allChallenges = [];

    try {
        allChallenges = await fetchChallenges();
    } catch (err) {
        console.error('Error fetching challenges in filterAllChallenges:', err);
        noMatchesInfo.textContent = 'Failed to load challenges.';
        return;
    }

    const includeOnline = onlineCheckbox.checked;
    const includeOnsite = onsiteCheckbox.checked;
    const minRatingChosen = getSelectedRatingValue(minRatingInputs);
    const maxRatingChosen = getSelectedRatingValue(maxRatingInputs);
    const keywordWritten = keywordInput.value.trim().toLowerCase();

    wrapper.innerHTML = '';
    noMatchesInfo.textContent = '';

    let result = allChallenges;
    result = filterByType(result, includeOnline, includeOnsite);
    result = filterByKeyword(result, keywordWritten);
    result = filterByRating(result, minRatingChosen, maxRatingChosen);
    result = filterByTags(result, selectedTags);

    if (result.length === 0) {
        noMatchesInfo.textContent = 'No matching challenges';
        return;
    }

    loadAllChallenges(result);
}

function filterByType(challenges, includeOnline, includeOnsite) {
    if (!includeOnline && !includeOnsite) return challenges;

    return challenges.filter(card => {
        if (includeOnline && card.type === 'online') return true;
        if (includeOnsite && card.type === 'onsite') return true;
        return false;
    });
}

function getSelectedRatingValue(radioInputs) {
    const checked = radioInputs.find(radio => radio.checked);
    return checked ? Number(checked.value) : null;
}

function filterByRating(challenges, minRating, maxRating) {
    if (minRating === null && maxRating === null) return challenges;

    if (minRating !== null && maxRating !== null && minRating > maxRating) {
        return [];
    }

    return challenges.filter(card => {
        const rating = Number(card.rating) || 0;
        if (minRating !== null && rating < minRating) return false;
        if (maxRating !== null && rating > maxRating) return false;
        return true;
    });
}

function filterByKeyword(challenges, keywordWritten) {
    if (!keywordWritten) return challenges;

    return challenges.filter(card =>
        card.title.toLowerCase().includes(keywordWritten) ||
        card.description.toLowerCase().includes(keywordWritten)
    );
}

function filterByTags(challenges, selectedTags) {
    if (!selectedTags.length) return challenges;

    return challenges.filter(challenge =>
        challenge.labels &&
        selectedTags.every(tag => challenge.labels.includes(tag))
    );
}

// Run once on page load
window.addEventListener("load", () => {
    applyHashFilter();
});

// Run every time the hash changes (menu clicks, links)
window.addEventListener("hashchange", () => {
    applyHashFilter();
});

// Function to check the hash and apply the correct filter
function applyHashFilter() {
    const hash = window.location.hash;

    if (hash === "#online") {
        onlineCheckbox.checked = true;
        onsiteCheckbox.checked = false;
        filterAllChallenges();
    }

    if (hash === "#onsite") {
        onsiteCheckbox.checked = true;   
        onlineCheckbox.checked = false;  
        filterAllChallenges();           
    }
}