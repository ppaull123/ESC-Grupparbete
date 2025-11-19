import { fetchChallenges } from "./api.js";
import { wrapper, loadAllChallenges } from "./challengecard.js"

//open filter form
const challengesFilterButton = document.querySelector('.btn-challengesFilter');
const filterForm = document.querySelector('.filterForm');

challengesFilterButton.addEventListener('click', () => {
    filterForm.classList.toggle('filterForm--active');
})

// add closing button for filter form
const filterForm__closeBtn = document.querySelector('.filterForm__closeBtn');

filterForm__closeBtn.addEventListener('click', () => {
    filterForm.classList.toggle('filterForm--active');
});

const tagList = document.querySelector('.tagFilter__list');

//render labels to filter form from API
async function renderTagsFromAPI() {
    try {
        // get all challenges as objects from API
        const challenges = await fetchChallenges();

        // pick up unique tags ("label" from API)
        const tagsSet = new Set();
        for (const ch of challenges) {
            const labels = ch.labels || [];
            for (const label of labels) {
                tagsSet.add(String(label));
            }
        }

        //clear <ul class="tagFilter__list"> before rendering tags
        if (tagList) {
            tagList.innerHTML = '';

            //render tags (text) in the filter form
            Array.from(tagsSet).forEach((tag, index, array) => {
                const li = document.createElement('li');
                li.className = 'tagFilter__item';

                //create <label> for tag checkboxes (<input>)s
                const label = document.createElement('label');
                label.className = 'tagFilter__label';

                //create <input> checkboxes  for tags ("label" from API)
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'tagFilter__checkbox';
                input.value = tag;
                input.style.position = 'absolute';
                input.style.opacity = '0';

                //create text for each tag <label>
                const tagText = document.createTextNode(tag);

                //input-label is a parent to both tag-checkbox(input) and tag-text ("label" from API)
                label.appendChild(input);
                label.appendChild(tagText);

                li.appendChild(label);
                tagList.appendChild(li);

                //add space between tags
                if (index < array.length - 1) {
                    const space = document.createTextNode(' ');
                    tagList.appendChild(space);
                }
            });
        }
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}
renderTagsFromAPI();

export{tagList}