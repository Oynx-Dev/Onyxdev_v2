// Initiate loading screen
function initiateLoadingScreen() {
    setTimeout(() => {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2000);
}



// Fetch and render games
async function fetchGames() {
    try {
        const response = await fetch('games.json');
        const games = await response.json();
        games.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem('games', JSON.stringify(games));
        renderGames(games, document.querySelector('.games-container'));
    } catch (error) {
        console.error('Error:', error);
    }
}

function createGameLink(game, cdn, imageCdn) {
    const link = document.createElement('a');
    link.className = 'block p-4 bg-gray-900 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition';
    link.href = 'play.html';
    link.addEventListener('click', () => {
        localStorage.setItem('game', JSON.stringify(game));
    });

    const img = document.createElement('img');
    img.src = `${imageCdn}${game.root}/${game.img}`;
    img.alt = game.name;
    img.className = 'w-full h-48 object-cover rounded-lg';

    const h3 = document.createElement('h3');
    h3.textContent = game.name;
    h3.className = 'text-white mt-2 text-center font-semibold';

    link.appendChild(img);
    link.appendChild(h3);
    return link;
}

function renderGames(games, container) {
    container.innerHTML = '';
    const selectedCdn = sessionStorage.getItem('selectedCdn') || 'https://assets.zyph3r.com/';
    const selectedImageCdn = sessionStorage.getItem('selectedImageCdn') || 'https://images.zyph3r.com/';
    games.forEach(game => {
        const gameLink = createGameLink(game, selectedCdn, selectedImageCdn);
        container.appendChild(gameLink);
    });
}

function renderAllGames() {
    const games = JSON.parse(localStorage.getItem('games')) || [];
    renderGames(games, document.querySelector('.games-container'));
}

// Search functionality
// const search = document.getElementById('searchbar');
// search.addEventListener('input', () => {
//     const searchTerm = search.value.toLowerCase();
//     const games = document.getElementsByClassName('block');
//     Array.from(games).forEach(game => {
//         const gameName = game.querySelector('h3').textContent.toLowerCase();
//         game.style.display = gameName.includes(searchTerm) ? 'block' : 'none';
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    showCdnPopup();
    fetchGames();
});

// Show image CDN selection popup only on games.html
if (window.location.pathname.endsWith('games.html')) {
    const imageCdnPopup = document.createElement('div');
    imageCdnPopup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    imageCdnPopup.innerHTML = `
        <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center space-y-4">
            <p class="text-lg font-semibold text-white">Select an image CDN:</p>
            <button id="image-cdn1-btn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Image CDN 1
            </button>
            <button id="image-cdn2-btn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Image CDN 2
            </button>
            <p class="text-gray-400">If one is blocked, images won’t show. Simply pick the other CDN.</p>
        </div>
    `;

    document.body.appendChild(imageCdnPopup);

    document.getElementById('image-cdn1-btn').addEventListener('click', () => {
        sessionStorage.setItem('selectedImageCdn', 'https://assets.zyph3r.com/');
        imageCdnPopup.remove();
        renderAllGames();
    });

    document.getElementById('image-cdn2-btn').addEventListener('click', () => {
        sessionStorage.setItem('selectedImageCdn', 'https://assets.onyxdev.me/');
        imageCdnPopup.remove();
        renderAllGames();
    });
}