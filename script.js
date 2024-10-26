const clientId = '4da5a5ff08664ff9bc5aa87dcc2e1728'; // Replace with your Client ID
const clientSecret = 'a142799b960b4172956135d5d5e03cd4'; // Replace with your Client Secret
const tokenUrl = 'https://accounts.spotify.com/api/token';
const genreUrl = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
const recommendationUrl = 'https://api.spotify.com/v1/recommendations';

// Function to get the access token
async function getAccessToken() {
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

// Function to get available genres
async function getGenres() {
    const token = await getAccessToken();
    const response = await fetch(genreUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.genres;
}

// Function to get recommendations based on selected genre
async function getRecommendations(genre) {
    const token = await getAccessToken();
    const response = await fetch(`${recommendationUrl}?seed_genres=${genre}&limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.tracks;
}

// Populate genre dropdown
async function populateGenres() {
    const genres = await getGenres();
    const genreSelect = document.getElementById('genreSelect');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

// Display recommendations
async function displayRecommendations() {
    const genre = document.getElementById('genreSelect').value;
    const recommendationsDiv = document.getElementById('recommendations');

    // Clear previous results
    recommendationsDiv.innerHTML = '';

    if (genre) {
        const tracks = await getRecommendations(genre);

        // Loop through recommended tracks and display details
        tracks.forEach(track => {
            const trackDiv = document.createElement('div');
            trackDiv.classList.add('track');
            trackDiv.innerHTML = `
                <strong>${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}
                <br><a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
            `;
            recommendationsDiv.appendChild(trackDiv);
        });
    } else {
        recommendationsDiv.innerHTML = 'Please select a genre.';
    }
}

// Initialize app by populating genres
populateGenres();

// Event listener for recommendations button
document.getElementById('getRecommendations').addEventListener('click', displayRecommendations);
