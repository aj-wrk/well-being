const clientId = "4da5a5ff08664ff9bc5aa87dcc2e1728";
const clientSecret = "a142799b960b4172956135d5d5e03cd4";
let accessToken;

// Fetch Spotify access token
async function fetchAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Fetch recommendations based on mood
async function fetchRecommendations(mood) {
    const genres = {
        happy: "pop",
        calm: "chill",
        sad: "acoustic"
        // Define other moods and corresponding genres here
    };

    const selectedGenre = genres[mood] || "pop";
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${selectedGenre}`, {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    });

    const data = await response.json();
    displayRecommendations(data.tracks);
}

// Display recommendations on the page
function displayRecommendations(tracks) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; // Clear previous recommendations

    tracks.forEach(track => {
        const trackDiv = document.createElement("div");
        trackDiv.classList.add("song");
        trackDiv.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}" width="100">
            <p><strong>${track.name}</strong></p>
            <p>${track.artists[0].name}</p>
            <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
        `;
        recommendationsDiv.appendChild(trackDiv);
    });
}

// Event listener for mood buttons
document.querySelectorAll(".mood-btn").forEach(button => {
    button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
        fetchRecommendations(mood);
    });
});

// Initialize access token on page load
window.onload = fetchAccessToken;
