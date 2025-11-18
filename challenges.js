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