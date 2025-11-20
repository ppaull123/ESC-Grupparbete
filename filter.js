import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges } from "./challengecard.js";
import { tagList } from "./challenges.js";

//find elements in the filter form
const onlineCheckbox = document.querySelector('#online_challenges');
const onsiteCheckbox = document.querySelector('#on-site_challenges');
const minRatingInputs = Array.from(document.querySelectorAll('input[name="minRating"]'));
const maxRatingInputs = Array.from(document.querySelectorAll('input[name="maxRating"]'));
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

//function for ALL FILTERS
async function filterAllChallenges() {
    //get all cards from API
    let allChallenges = [];
    try {
        allChallenges = await fetchChallenges();
    } catch (err) {
        console.error('Error fetching challenges in filterAllChallenges:', err);
        if (noMatchesInfo) noMatchesInfo.textContent = 'Failed to load challenges.';
        return;
    }

    //take user's input
    // 1) CHECKBOXES
    const includeOnline = onlineCheckbox.checked;
    const includeOnsite = onsiteCheckbox.checked;
    // 4)KEYWORD (from title of description)
    const keyword = keywordInput.value.trim().toLowerCase();

    //clear the container before rendring
    wrapper.innerHTML = '';
    noMatchesInfo.textContent = '';

    //calling all filtering functions
    let result = allChallenges;
    result = filterByType(result, includeOnline, includeOnsite);
    result = filterByKeyword(result, keyword);
    // result = filterByRating(result, min, max);
    // result = filterByTags(result, selectedTags);

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

// 4) KEYWORD FILTER function (keyword from title or description) 
//if input is empty  filter is not applied
function filterByKeyword(challenges, keyword) {

    if (!keyword || keyword.trim() === '') return challenges;
    const searchKeyword = keyword.toLowerCase().trim();

    return challenges.filter(card => {
        const title = card.title.toLowerCase().trim();
        const description = card.description.toLowerCase().trim();

        return title.includes(searchKeyword) || description.includes(searchKeyword);
    })
}
