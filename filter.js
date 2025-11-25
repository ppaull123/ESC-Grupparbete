import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges, allLabels } from "./challengecard.js";


//find elements in the filter form
const onlineCheckbox = document.querySelector('#online_challenges');
const onsiteCheckbox = document.querySelector('#on-site_challenges');
const minRatingInputs = Array.from(document.querySelectorAll('input[name="minRating"]'));
const maxRatingInputs = Array.from(document.querySelectorAll('input[name="maxRating"]'));
const keywordInput = document.querySelector('.keywordFilter__input');
const noMatchesInfo = document.querySelector('.filterForm__info');
const tagFilterList = document.querySelector(".tagFilter__list");
const tags = allLabels;

//add EventListeners to all filters
onlineCheckbox.addEventListener('change', filterAllChallenges);
onsiteCheckbox.addEventListener('change', filterAllChallenges);
keywordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterAllChallenges();
    }
});
minRatingInputs.forEach(input => {
    input.addEventListener('change', filterAllChallenges);
});
maxRatingInputs.forEach(input => {
    input.addEventListener('change', filterAllChallenges);
});

let selectedTags = [];

tags.forEach(tag => {
    const li = document.createElement("li");
    li.textContent = tag;
    li.classList.add("tagFilter__item");

    li.addEventListener("click", () => {
        toggleTag(tag, li);
        filterAllChallenges();
    });

    tagFilterList.appendChild(li);
});

function toggleTag(tag, element) {
    if(selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        element.classList.remove("tagFilter__item--selected");
    }
    else {
        selectedTags.push(tag);
        element.classList.add("tagFilter__item--selected");
    }
}


//function for ALL FILTERS
async function filterAllChallenges() {
    //get all cards from API
    let allChallenges = [];
    try {
        allChallenges = await fetchChallenges();
    } catch (err) {
        console.error('Error fetching challenges in filterAllChallenges:', err);
        noMatchesInfo.textContent = 'Failed to load challenges.';
        return;
    }

    //take user's input
    // 1) CHECKBOXES
    const includeOnline = onlineCheckbox.checked;
    const includeOnsite = onsiteCheckbox.checked;
    // 2) RATING (from min to max)
    const minRatingChosen = getSelectedRatingValue(minRatingInputs);
    const maxRatingChosen = getSelectedRatingValue(maxRatingInputs);
    // 4)KEYWORD (from title of description)
    const keywordWritten = keywordInput.value.trim().toLowerCase();

    //clear the container before rendring
    wrapper.innerHTML = '';
    noMatchesInfo.textContent = '';

    //calling all filtering functions
    let result = allChallenges;
    result = filterByType(result, includeOnline, includeOnsite);
    result = filterByKeyword(result, keywordWritten);
    result = filterByRating(result, minRatingChosen, maxRatingChosen);
    result = filterByTags(result, selectedTags);

    //if no cards found by filtering, show notice 'No matching challenges'
    if (result.length === 0) {
        noMatchesInfo.textContent = 'No matching challenges';
        return;
    }

    //render cards after filtering
    loadAllChallenges(result);
}


// 1) CHECKBOX FILTER function (online/ on-site checkboxes) 
//if no checkbox chosen filter isn't applied
function filterByType(challenges, includeOnline, includeOnsite) {
    if (!includeOnline && !includeOnsite) return challenges;

    return challenges.filter(card => {
        if (includeOnline && card.type === 'online') return true;
        if (includeOnsite && card.type === 'onsite') return true;
        return false;
    });
}

// 2) RATING FILTER (from min till max rating)
// 2.1) get rating from user and translate into numbers
function getSelectedRatingValue(radioInputs) {
    if (!Array.isArray(radioInputs)) return null;
    const checked = radioInputs.find(radio => radio.checked);
    if (checked) return Number(checked.value);
    else return null;
}
// 2.2) RATING FILTER function(from min till max rating)
//if no rating chosen filter isn't applied
function filterByRating(challenges, minRating, maxRating) {
   let min;
    if (minRating == null) min = null;
    else min = Number(minRating);

    let max;
    if (maxRating == null) max = null;
    else max = Number(maxRating);

    if (min === null && max === null) return challenges;

    //if in API not a number
    if (Number.isNaN(min) || Number.isNaN(max)) return [];

    //if min > max
    if (min != null && max != null && min > max) return [];
    //all other cases
    return challenges.filter(card => {
        const rating = Number(card.rating) || 0;
        if (min !== null && max !== null) return rating >= min && rating <= max;
        if (min !== null) return rating >= min;
        if (max !== null) return rating <= max;
        return true;
    });
}

// 4) KEYWORD FILTER function (keyword from title or description) 
//if input is empty  filter is't applied
function filterByKeyword(challenges, keywordWritten) {

    if (!keywordWritten || keywordWritten.trim() === '') return challenges;
    const searchKeyword = keywordWritten.toLowerCase().trim();

    return challenges.filter(card => {
        const title = card.title.toLowerCase().trim();
        const description = card.description.toLowerCase().trim();

        return title.includes(searchKeyword) || description.includes(searchKeyword);
    })
}

function filterByTags(challenges, selectedTags) {
    if(!selectedTags.length)
        return challenges;

    return challenges.filter(challenge =>
        challenge.labels && selectedTags.every(tag => challenge.labels.includes(tag))
    )
}