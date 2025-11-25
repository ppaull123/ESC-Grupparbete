import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges } from "./challengecard.js"

//open filter form
const challengesFilterButton = document.querySelector('.btn-challengesFilter');
const filterForm = document.querySelector('.filterForm');

challengesFilterButton.addEventListener('click', () => {
    filterForm.classList.toggle('filterForm--active');
})

const noMatchesInfo = document.querySelector('.filterForm__info');

// add closing button for filter form
const filterForm__closeBtn = document.querySelector('.filterForm__closeBtn');
filterForm__closeBtn.style.cursor = 'pointer';

filterForm__closeBtn.addEventListener('click', async () => {
    filterForm.classList.remove('filterForm--active');

    //render all cards after filter form is closed
    //clear up filters from previous input
    try {
        const allChallenges = await fetchChallenges();
        loadAllChallenges(allChallenges);
        noMatchesInfo.textContent = '';
        filterForm.reset();
    } catch (error) {
        console.error('Error reloading all challenges:', error);
    }
});
