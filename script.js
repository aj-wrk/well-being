const clientId = '5ce6c394f74f4c7bb2bcffef6bff236a';
const clientSecret = 'eb263a1800f04db99c6fa81697a0487a';
const redirectUri = 'https://aj-wrk.github.io/well-being/'; // Set to your local environment or hosting URL

let accessToken = null;

document.getElementById('login-btn').addEventListener('click', function () {
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20playlist-read-private`;
    window.location.href = url;
});

function getTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = hash.split('&').reduce(function (acc, item) {
        let parts = item.split('=');
        acc[parts[0]] = decodeURIComponent(parts[1]);
        return acc;
    }, {});
    return params;
}

function setAccessToken() {
    const params = getTokenFromUrl();
    if (params.access_token) {
        accessToken = params.access_token;
        window.location.hash = ''; // Clear the token from the URL
        loadUserPlaylists();
    }
}









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
