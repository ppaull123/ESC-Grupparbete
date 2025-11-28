const { filterByType } = require('../filters/filter_by_type');

//mocking data from API for testing
const MOCK_CHALLENGES = [
    { id: 1, type: 'onsite', title: 'Game 2000' },
    { id: 2, type: 'online', title: 'Hacking demystified' },
    { id: 3, type: 'onsite', title: 'Shell online' },
];

describe('function filterByType', () => {
    //test 1
    test('filterByType: should return all challenges if no filters are selected', () => {
        // Calling function without selected checkboxes
        const result = filterByType(MOCK_CHALLENGES, false, false);

        //Check that result is equal to the original array
        expect(result).toEqual(MOCK_CHALLENGES);
        console.log('Array received for no checkboxes marked (filter by type is not applied):', JSON.stringify(result, null, 1));
        console.log(`Array length: ${result.length}`);

        expect(result.length).toBe(3);
    });

    //test 2
    test('filterByType: should return only online challenges if includeOnline is true', () => {
        // we expect only result id: 2 (index [1] in MOCK_CHALLENGES)
        const EXPECTED_ONLINE = [
            MOCK_CHALLENGES[1],
        ];

        // 1. call function filterByType (includeOnline: true, includeOnsite: false)
        const result = filterByType(MOCK_CHALLENGES, true, false);

        // 2. checking that the received array coinsides with en array from const EXPECTED_ONLINE
        expect(result).toEqual(EXPECTED_ONLINE);
        console.log('Array received for online challenges:', JSON.stringify(result, null, 1));
        console.log(`Array length: ${result.length}`);

        // 3. check the length of the received array
        expect(result.length).toBe(1);
    });

    //test 3
    test('filterByType: should return only onsite challenges if includeOnsite is true', () => {
        // we expect only result id: 1 and 3 (index [0], [2] in MOCK_CHALLENGES)
        const EXPECTED_ONSITE = [
            MOCK_CHALLENGES[0],
            MOCK_CHALLENGES[2],
        ];

        // 1. call function filterByType (includeOnline: false, includeOnsite: true)
        const result = filterByType(MOCK_CHALLENGES, false, true);

        // 2. checking that the received array coinsides with en array from const EXPECTED_ONSITE
        expect(result).toEqual(EXPECTED_ONSITE);
        console.log(result);

        // 3. check the length of the received array
        expect(result.length).toBe(2);

        console.log('Array received for onsite challenges:', JSON.stringify(result, null, 1));
        console.log(`Array length: ${result.length}`);

    });

    //test 4
    test('filterByType: should return both onsite and onsite challenges if includeOnsite and icludeOnsite both are true', () => {
        // we expect only result id: 1 and 3 (index [0], [2] in MOCK_CHALLENGES)
        const EXPECTED_ALL = [
            MOCK_CHALLENGES[0],
            MOCK_CHALLENGES[1],
            MOCK_CHALLENGES[2],
        ];

        // 1. call function filterByType (includeOnline: true, includeOnsite: true)
        const result = filterByType(MOCK_CHALLENGES, true, true);

        // 2. checking that the received array coinsides with en array from const EXPECTED_ALL
        expect(result).toEqual(EXPECTED_ALL);
        console.log(result);

        // 3. check the length of the received array
        expect(result.length).toBe(3);

        console.log('Array received for all challenges (both online and onsite filter is applied):', JSON.stringify(result, null, 1));
        console.log(`Array length: ${result.length}`);
    });
});

