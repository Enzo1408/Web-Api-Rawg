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

    // Ajoute div dans gameElement pour la photo du jeu en question
    const gameHeader = document.createElement('div');
    gameHeader.classList.add('game_photo');

    // Ajoute div dans gameElement pour les infos du jeu en question
    const gameFooter = document.createElement('div');
    gameFooter.classList.add('game_info');

    // Ajouter les nouveaux éléments div à la galerie
    wrapperGallery.appendChild(gameElement);
    gameElement.appendChild(gameHeader);
    gameElement.appendChild(gameFooter);
    console.log(gameElement.style.gridArea);
}

// catch_list_game();