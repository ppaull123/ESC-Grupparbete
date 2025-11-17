export async function fetchChallenges() {
    const userErrorMessage = "Failed to load challenges, please come back later.";

    try {
        const res = await fetch("https://lernia-sjj-assignments.vercel.app/api/challenges");
        
        if (!res.ok) throw new Error(userErrorMessage);

        const data = await res.json();
        return data.challenges;
    } catch (error) {
        console.error("Error fetching API:", error);
        const errorWrapper = document.querySelector(".error__wrapper");
        if (errorWrapper) {
            errorWrapper.textContent = userErrorMessage;
        }
        return [];
    }
}
