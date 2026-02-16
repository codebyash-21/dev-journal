// Page Elements
const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const popup = document.getElementById("popup");

const challengeInput = document.getElementById("challengeInput");
const descriptionInput = document.getElementById("descriptionInput");
const imageInput = document.getElementById("imageInput");

const streakCount = document.getElementById("streakCount");
const entriesSection = document.getElementById("entriesSection");

// Load streak
let streak = localStorage.getItem("streak") || 0;
streakCount.textContent = streak;

// Load saved entries on start
window.onload = function () {
    displayEntries();
};

// STEP 1: Submit Challenge
function submitChallenge() {
    const value = challengeInput.value.trim();

    if (value === "" || isNaN(value) || Number(value) <= 0) {
        alert("Enter a valid challenge number.");
        return;
    }

    // Increase streak
    streak++;
    localStorage.setItem("streak", streak);
    streakCount.textContent = streak;

    // Show popup
    popup.classList.remove("hidden");

    // Confetti 🎉
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });

    // After 2 seconds → go to page2
    setTimeout(() => {
        popup.classList.add("hidden");
        page1.classList.remove("active");
        page1.classList.add("hidden");

        page2.classList.remove("hidden");
        page2.classList.add("active");
    }, 2000);
}

// STEP 2: Save Entry
function saveEntry() {
    const description = descriptionInput.value.trim();
    const file = imageInput.files[0];

    if (description === "") {
        alert("Please write what you solved.");
        return;
    }

    if (!file) {
        alert("Please upload a screenshot.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const imageBase64 = reader.result;

        const entry = {
            description: description,
            image: imageBase64
        };

        let entries = JSON.parse(localStorage.getItem("entries")) || [];
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));

        // Clear fields
        descriptionInput.value = "";
        imageInput.value = "";

        // Switch back to page1
        page2.classList.remove("active");
        page2.classList.add("hidden");

        page1.classList.remove("hidden");
        page1.classList.add("active");

        displayEntries();
    };

    reader.readAsDataURL(file);
}

// Display Saved Entries
function displayEntries() {
    entriesSection.innerHTML = "";

    const entries = JSON.parse(localStorage.getItem("entries")) || [];

    entries.reverse().forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("entry-card");

        card.innerHTML = `
            <p>${entry.description}</p>
            <img src="${entry.image}" alt="Screenshot">
        `;

        entriesSection.appendChild(card);
    });
}
