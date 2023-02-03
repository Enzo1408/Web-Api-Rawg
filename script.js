let jsondata_games = {};
let selectPageId = 0;
const wrapperGallery = document.querySelector('.wrapper-gallery');

async function catch_list_game() {
    let response = await fetch("data.json");
    const data = await response.json();
    jsondata_games = data;
    return data;
} 

catch_list_game().then(() => {
    console.log(jsondata_games);
    display_games(wrapperGallery);
    display_page_selector();
});


function display_page_selector() {
    const pageSelector = document.querySelector(".page_select");
    pageSelector.innerHTML = "";

    const start = Math.max(1, selectPageId - 3);
    const end = Math.min(selectPageId + 5, 99);

    const createButton = (pageNum) => {
        const btnPage = document.createElement("button");
        btnPage.innerHTML = pageNum;
        btnPage.addEventListener("click", () => {
        selectPageId = pageNum - 1;
        jsondata_games = {};
        catch_list_game().then(() => {
            display_games(wrapperGallery);
            display_page_selector();
        });
    });
        return btnPage;
    }

    pageSelector.appendChild(createButton(1));
    if (start > 1){
        const btnPage = document.createElement("button");
        btnPage.innerHTML = "...";
        pageSelector.appendChild(btnPage);
    }

    for (let i = start; i < end; i++) {
        pageSelector.appendChild(createButton(i + 1));
    }

    if (end < 99) {
        const btnPage = document.createElement("button");
        btnPage.innerHTML = "...";
        pageSelector.appendChild(btnPage);
        pageSelector.appendChild(createButton(99));
    }
    
}

function display_games(wrapper) {
    wrapper.innerHTML = "";
    const startIndex = selectPageId * 24;
    const endIndex = startIndex + 24;
    const games = jsondata_games.slice(startIndex, endIndex);
    console.log(games);

    for (let i = 0; i < games.length; i++){
        const game = games[i];
        // Injecte des div dans le HTML
        const gameElement = document.createElement('div');
        // Ajoute à chaque div la classe .game
        gameElement.classList.add('game');
        // Positionne chaque case dans la grid en utilisant grid-area CSS
        gameElement.style.gridArea = `game${i+1}`;

        // Ajoute div dans gameElement pour la photo du jeu en question
        
        const gameHeader = document.createElement('div');
        gameHeader.classList.add('game_photo');
        const Photo = document.createElement('img');
        Photo.src = game.background_image;

        // Ajoute div dans gameElement pour les infos du jeu en question
        const gameFooter = document.createElement('div');
        gameFooter.classList.add('game_info');

        const gamePlatform = document.createElement('div');
        gamePlatform.classList.add('game_platform');
        display_platform(i, gamePlatform);

        const gameTitle = document.createElement('div');
        gameTitle.classList.add('game_title');
        const Title = document.createElement('p');
        Title.innerHTML = game.name;

        // Ajouter les nouveaux éléments div à la galerie
        wrapper.appendChild(gameElement);
        gameElement.appendChild(gameHeader);
        gameElement.appendChild(gameFooter);
        gameFooter.appendChild(gamePlatform);
        gameFooter.appendChild(gameTitle);
        gameHeader.appendChild(Photo);
        gameTitle.appendChild(Title);
    }
}

function display_platform (Index_game, parent_div) {
    const startIndex = selectPageId * 24;
    const endIndex = startIndex + 24;
    const games = jsondata_games.slice(startIndex, endIndex);

    const game = games[Index_game];

    const platforms = game.platforms;
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
        else if (platforms[i].platform.name == "Web"){
            Platforms.className = 'fab fa-google fa-custom2';
        }
        parent_div.appendChild(Platforms);
    }
}
