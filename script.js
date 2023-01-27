function catch_list_game() {
    fetch('https://api.rawg.io/api/creators/1?key=2a1057a727d346c6bff6246fa3ea781b')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
}

const wrapperGallery = document.querySelector('.wrapper-gallery');
for (let i = 1; i <= 16; i++){
    // Injecte des div dans le HTML
    const gameElement = document.createElement('div');

    // Ajoute à chaque div la classe .game
    gameElement.classList.add('game');

    // Positionne chaque case dans la grid en utilisant grid-area CSS
    gameElement.style.gridArea = `game${i}`;

    // Ajouter le nouvel élément div à la galerie
    wrapperGallery.appendChild(gameElement);
}

// catch_list_game();