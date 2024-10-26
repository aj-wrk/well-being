const clientId = '4da5a5ff08664ff9bc5aa87dcc2e1728'; // Replace with your Client ID
const clientSecret = 'a142799b960b4172956135d5d5e03cd4'; // Replace with your Client Secret
const tokenUrl = 'https://accounts.spotify.com/api/token';
const playlistsUrl = 'https://api.spotify.com/v1/search';

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

async function searchPlaylists(artist) {
    const token = await getAccessToken();
    const response = await fetch(`${playlistsUrl}?q=${artist}&type=playlist`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.playlists.items;
}

document.getElementById('searchButton').addEventListener('click', async () => {
    const artistName = document.getElementById('artistName').value;
    const playlistsDiv = document.getElementById('playlists');

    // Clear previous results
    playlistsDiv.innerHTML = '';

    if (artistName) {
        const playlists = await searchPlaylists(artistName);

        // Loop through the playlists array and display each playlist
        if (playlists.length > 0) {
            playlists.forEach(playlist => {
                const playlistDiv = document.createElement('div');
                playlistDiv.classList.add('playlist');
                playlistDiv.innerHTML = `
                    <strong>${playlist.name}</strong> - ${playlist.tracks.total} tracks
                    <br><a href="${playlist.external_urls.spotify}" target="_blank">Listen</a>
                `;
                playlistsDiv.appendChild(playlistDiv);
            });
        } else {
            playlistsDiv.innerHTML = 'No playlists found.';
        }
    } else {
        playlistsDiv.innerHTML = 'Please enter an artist name.';
    }
});