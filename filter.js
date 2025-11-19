import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges } from "./challengecard.js";
import { tagList} from "./challenges.js";

//find elements in the filter form
const onlineCheckbox = document.querySelector('#online_challenges');
const onsiteCheckbox = document.querySelector('#on-site_challenges');
const minRatingInputs = Array.from(document.querySelectorAll('input[name="minRating"]'));
const maxRatingInputs = Array.from(document.querySelectorAll('input[name="maxRating"]'));
const keywordInput = document.querySelector('.keywordFilter__input');
const noMatchesInfo = document.querySelector('.filterForm__info');

//function for ALL FILTERS
async function filterAllChallenges() {
    //get all cards from API
    const allChallenges = await fetchChallenges();

    // 1) apply CHECKBOX FILTER function (online/ on-site checkboxes) 
    //checkboxes id="online_challenges" / id="on-site_challenges" state "checked"
    const includeOnline = onlineCheckbox.checked;
    const includeOnsite = onsiteCheckbox.checked;

    //if neither 'online' nor 'on-site' checkbox is checked -> don't show any cards
    if (!includeOnline && !includeOnsite) {
        wrapper.innerHTML = '';
        return;
    }

    //filter by type (online/ on-site) - apply function filterByType()
    const filteredByType = filterByType(allChallenges, includeOnline, includeOnsite);

    // clear the container before rendring
    wrapper.innerHTML = '';
    // render cards by type
    loadAllChallenges(filteredByType);
}

//add EventListeners to all filters
onlineCheckbox.addEventListener('change', filterAllChallenges);
onsiteCheckbox.addEventListener('change', filterAllChallenges);

//CHECKBOX FILTER function (online/ on-site checkboxes) 
function filterByType(challenges, includeOnline, includeOnsite) {
    return challenges.filter(card => {
        const type = card.type;

        if (includeOnline && type === 'online') return true;
        if (includeOnsite && type === 'onsite') return true;

        return false;
    });
}


