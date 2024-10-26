const tokenUrl = 'https://accounts.spotify.com/api/token';
const artistInput = document.getElementById('artist-input');
const artistList = document.getElementById('artist-list');
const accessToken = tokenUrl; // Replace with your token

artistInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=artist`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        artistList.innerHTML = '';
        data.artists.items.forEach(artist => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = artist.name;
            li.dataset.artistId = artist.id;
            artistList.appendChild(li);
        });
    }
});



const playlistContainer = document.getElementById('playlist-container');

async function generatePlaylist(mood, artistId) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${mood}&seed_artists=${artistId}&limit=10`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    playlistContainer.innerHTML = '';
    data.tracks.forEach(track => {
        const div = document.createElement('div');
        div.className = 'track';
        div.innerHTML = `<p>${track.name} by ${track.artists[0].name}</p>`;
        playlistContainer.appendChild(div);
    });
}

// Call generatePlaylist with mood and artist ID (captured from user selections).
generatePlaylist(selectedMood, selectedArtistId);
