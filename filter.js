import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges } from "./challengecard.js";
import { tagList } from "./challenges.js";

//find elements in the filter form
const onlineCheckbox = document.querySelector('#online_challenges');
const onsiteCheckbox = document.querySelector('#on-site_challenges');
const minRatingInputs = Array.from(document.querySelectorAll('.minRating__input'));
const maxRatingInputs = Array.from(document.querySelectorAll('.maxRating__input'));
const keywordInput = document.querySelector('.keywordFilter__input');
const noMatchesInfo = document.querySelector('.filterForm__info');

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
function filterByRating(challenges, minRating, maxRating) {
    let min;
    if (minRating == null) min = null;
    else min = Number(minRating);

    let max;
    if (maxRating == null) max = null;
    else max = Number(maxRating);

    //if no rating chosen filter isn't applied
    if (min === null && max === null) return challenges;

    //if rating in API not a number no cards rendered
    if (Number.isNaN(min) || Number.isNaN(max)) return [];
    //if min > max no cards rendered
    if (min != null && max != null && min > max) return [];

    //all other cases
    return challenges.filter(card => {
        const rating = Number(card.rating) || 0;
        //min < rating < max
        if (min !== null && max !== null) return rating >= min && rating <= max;
        //only min rating is marked
        if (min !== null) return rating >= min;
        //only max rating is marked
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
