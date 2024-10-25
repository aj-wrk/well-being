// Spotify Credentials
const clientId = '4da5a5ff08664ff9bc5aa87dcc2e1728';  // Use your client ID
const redirectUri = 'https://aj-wrk.github.io/well-being/';  // Replace with your actual redirect URI

// Spotify Authorization Endpoint
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Scopes that define the permissions the app will need
const scopes = [
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public'
].join('%20');  // Space-separated scopes for the URL

// Handle the login button
document.getElementById('login-btn').addEventListener('click', () => {
    const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
    window.location.href = loginUrl;
});

// After login, extract the access token from the URL
function getTokenFromUrl() {
    const hash = window.location.hash;
    if (hash) {
        const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
        localStorage.setItem('spotifyAccessToken', token);
        window.location.hash = '';  // Clear the hash from the URL
    }
}

getTokenFromUrl();

// Handle playlist creation based on mood or randomization
document.getElementById('randomize-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) {
        alert('Please log in first!');
        return;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        // Get a random playlist from user's collection
        const randomPlaylist = data.items[Math.floor(Math.random() * data.items.length)];

        alert(`Your random playlist is: ${randomPlaylist.name}`);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        alert('Failed to fetch playlists.');
    }
});









function loadUserPlaylists() {
    fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
        .then(response => response.json())
        .then(data => {
            displayPlaylists(data.items);
        })
        .catch(err => console.error(err));
}

function displayPlaylists(playlists) {
    const playlistContainer = document.getElementById('playlists');
    playlistContainer.innerHTML = ''; // Clear previous playlists

    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('card', 'mb-3');
        playlistElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${playlist.name}</h5>
                <p class="card-text">Tracks: ${playlist.tracks.total}</p>
            </div>
        `;
        playlistContainer.appendChild(playlistElement);
    });
}

window.onload = setAccessToken;



document.getElementById('relax').addEventListener('click', function () {
    fetchPlaylistsByMood('relax');
});

document.getElementById('focus').addEventListener('click', function () {
    fetchPlaylistsByMood('focus');
});

document.getElementById('energize').addEventListener('click', function () {
    fetchPlaylistsByMood('energize');
});

function fetchPlaylistsByMood(mood) {
    let categoryId;
    if (mood === 'relax') {
        categoryId = 'chill'; // Spotify category ID for relaxing music
    } else if (mood === 'focus') {
        categoryId = 'focus';
    } else if (mood === 'energize') {
        categoryId = 'workout';
    }

    fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
        .then(response => response.json())
        .then(data => {
            displayPlaylists(data.playlists.items);
        })
        .catch(err => console.error(err));
}
