let jsondata_games = {};

async function catch_list_game() {
    const response = await fetch('https://api.rawg.io/api/games?key=2a1057a727d346c6bff6246fa3ea781b&page_size=16');
    const data = await response.json();
    jsondata_games = data;
    return data;
}

catch_list_game().then(() => {
    const wrapperGallery = document.querySelector('.wrapper-gallery');
    console.log(jsondata_games);
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
        const Photo = document.createElement('img');
        Photo.src = jsondata_games.results[i-1].background_image;

        // Ajoute div dans gameElement pour les infos du jeu en question
        const gameFooter = document.createElement('div');
        gameFooter.classList.add('game_info');

        const gamePlatform = document.createElement('div');
        gamePlatform.classList.add('game_platform');
        display_platform(i-1, gamePlatform);

        const gameTitle = document.createElement('div');
        gameTitle.classList.add('game_title');
        const Title = document.createElement('p');
        Title.innerHTML = jsondata_games.results[i-1].name;

        // Ajouter les nouveaux éléments div à la galerie
        wrapperGallery.appendChild(gameElement);
        gameElement.appendChild(gameHeader);
        gameElement.appendChild(gameFooter);
        gameFooter.appendChild(gamePlatform);
        gameFooter.appendChild(gameTitle);
        gameHeader.appendChild(Photo);
        gameTitle.appendChild(Title);
    }
});

function display_platform (Index_game, parent_div) {
    const platforms = jsondata_games.results[Index_game].parent_platforms;
    let array_length = platforms.length;
    for (let i = 0; i < array_length; i++){
        const Platforms = document.createElement('i');
        if (platforms[i].platform.name == "PC"){
            Platforms.className = 'fab fa-windows fa-custom2';
        }
        else if (platforms[i].platform.name == "PlayStation"){
            Platforms.className = 'fab fa-playstation fa-custom2';
        }
        else if (platforms[i].platform.name == "Xbox"){
            Platforms.className = 'fab fa-xbox fa-custom2';
        }
        else if (platforms[i].platform.name == "Nintendo"){
            Platforms.className = 'fa fa-gamepad fa-custom2';
        }
        else if (platforms[i].platform.name == "iOS"){
            Platforms.className = 'fab fa-apple fa-custom2';
        }
        else if (platforms[i].platform.name == "Android"){
            Platforms.className = 'fab fa-android fa-custom2';
        }
        else if (platforms[i].platform.name == "Apple Macintosh"){
            Platforms.className = 'fab fa-apple fa-custom2';
        }
        else if (platforms[i].platform.name == "Linux"){
            Platforms.className = 'fab fa-linux fa-custom2';
        }
        parent_div.appendChild(Platforms);
    }
}
