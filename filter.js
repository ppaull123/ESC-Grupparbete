import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges, allLabels } from "./challengecard.js";

//find elements in the filter form
const onlineCheckbox = document.querySelector('#online_challenges');
const onsiteCheckbox = document.querySelector('#on-site_challenges');
const minRatingInputs = Array.from(document.querySelectorAll('.minRating__input'));
const maxRatingInputs = Array.from(document.querySelectorAll('.maxRating__input'));
const keywordInput = document.querySelector('.keywordFilter__input');
const noMatchesInfo = document.querySelector('.filterForm__info');
let selectedTags = [];
let tagFilterList = document.querySelector(".tagFilter__list");



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

//cancel rating filter with the second click on same star
//add custom data-attribute wasChecked to mark a checked star
document.querySelectorAll('.minRating__input, .maxRating__input').forEach(input => {
    input.dataset.wasChecked = input.checked ? 'true' : 'false';
});

document.querySelectorAll('.minRating__input, .maxRating__input')
    .forEach(input => {
        input.addEventListener('click', function () {
            //define group min or max
            const group = this.classList.contains('minRating__input')
                ? document.querySelectorAll('.minRating__input')
                : document.querySelectorAll('.maxRating__input');

            if (this.dataset.wasChecked === 'true') {
                //cancel chosen group with the second click
                group.forEach(input => {
                    input.checked = false;
                    input.dataset.wasChecked = 'false';
                    //inform parent eventListener that applies filter abt change of status of chosen star 
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                });
            } else {
                //update wasChecked status for the newly selected star
                group.forEach(input => {
                    input.checked = false;
                    input.dataset.wasChecked = 'false';
                });
                this.checked = true;
                this.dataset.wasChecked = 'true';
                this.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
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

    //clear the container before rendering
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

// 3) TAG FILTER
// 3.1) create a tag list in the Filter form
function setupTagFilter() {
    if (!tagFilterList) return;

    tagFilterList.innerHTML = "";

    allLabels.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = tag;
        li.classList.add("tagFilter__item");
        //get user's input
        li.addEventListener("click", () => {
            toggleTag(tag, li);
            filterAllChallenges();
        });

        tagFilterList.appendChild(li);
    });
}
// 3.2) apply styles to chosen tags
function toggleTag(tag, element) {
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        element.classList.remove("tagFilter__item--selected");
    } else {
        selectedTags.push(tag);
        element.classList.add("tagFilter__item--selected");
    }
}
//3.3)if no tags chosen filter isn't applied
// cards only matched with all selected tags will be visible
function filterByTags(challenges, selectedTags) {
    if (!selectedTags.length) return challenges;
    return challenges.filter(challenge =>
        challenge.labels &&
        selectedTags.every(tag => challenge.labels.includes(tag))
    );
}

// 4) KEYWORD FILTER function (keyword from title or description) 
//if input is empty  filter is't applied
function filterByKeyword(challenges, keyword) {
    if (!keyword || keyword.trim() === '') return challenges;
    const searchKeyword = keyword.toLowerCase().trim();

    //if user enters less then 3 signs in the input - all the cards are shown
    if (searchKeyword.length < 3) return challenges;

    return challenges.filter(card => {
        const title = card.title.toLowerCase().trim();
        const description = card.description.toLowerCase().trim();
        return title.includes(searchKeyword) || description.includes(searchKeyword);
    });
}

// Run once on page load
window.addEventListener("load", () => {
    setupTagFilter();
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
        onlineCheckbox.checked = true;   // Turn on online filter
        onsiteCheckbox.checked = false;  // Turn off on-site filter
        filterAllChallenges();           // Run filtering
    }

    if (hash === "#onsite") {
        onsiteCheckbox.checked = true;
        onlineCheckbox.checked = false;
        filterAllChallenges();
    }
}
