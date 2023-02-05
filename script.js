let jsondata_games = {};
let jsondata_infos_games = {};
let selectPageId = 0;
const wrapper_parent = document.querySelector('.wrapper');
const wrapperGallery = document.querySelector('.wrapper-gallery');
const wrapperPageSelector = document.querySelector('.page_select');


function calculate_rating (game){
    let average = 0;
    let totalCount = 0;
    for (let rating of game.rating) {
        if (rating.id == 5) {
            average = average + 100 * rating.count;
        }
        else if (rating.id == 4) {
            average = average + 75 * rating.count;
        }
        else if (rating.id == 3) {
            average = average + 50 * rating.count;
        }
        else if (rating.id == 1) {
            average = average + 25 * rating.count;
        }
        totalCount = totalCount + rating.count;
    }
    return Math.floor(average/totalCount);
}

function display_rating_color(rating, score){
    let color, border;
    if (score < 50){
        color = "red";
        border = "2px solid red";
    }
    else if (score < 80 && score >= 50){
        color = "yellow";
        border = "2px solid yellow";
    }
    else if (score >= 80){
        color = "green";
        border = "2px solid green";
    }
    rating.style.color = color;
    rating.style.border = border;
}

function display_all_rates (game, parent_div){
    let fontsize = window.innerWidth > 1200 ? 20 : 15;

    let exceptionnal = document.createElement('p');
    let good = document.createElement('p');
    let notgood = document.createElement('p');
    let worst = document.createElement('p');

    for (let rate of game.rating) {
        if (rate.id == 5) {
            exceptionnal.textContent = "\u{1F451} " + rate.percent + '%';
            exceptionnal.style.fontSize = fontsize + "px";
        }
        if (rate.id == 4) {
            good.textContent = "\u{1F44D} " + rate.percent + '%';
            good.style.fontSize = fontsize + "px";          
        }
        if (rate.id == 3) {
            notgood.textContent = "\u{1F44E} " + rate.percent + '%';
            notgood.style.fontSize = fontsize + "px";
        }
        if (rate.id == 1) {
            worst.textContent = "\u{1F6D1} " + rate.percent + '%';
            worst.style.fontSize = fontsize + "px";
        }
        parent_div.appendChild(exceptionnal);
        parent_div.appendChild(good);
        parent_div.appendChild(notgood);
        parent_div.appendChild(worst);
    }
}


function display_page_selector() {
    const pageSelector = document.querySelector(".page_select");
    pageSelector.innerHTML = "";

    const start = Math.max(1, selectPageId - 3);
    const end = Math.min(selectPageId + 5, 99);

    const createButton = (pageNum) => {
        const btnPage = document.createElement("button");
        btnPage.innerHTML = pageNum;
        if (pageNum === selectPageId + 1) {
            btnPage.style.borderBottom = "2px solid white";
        }
        btnPage.addEventListener("click", () => {
            selectPageId = pageNum - 1;
            display_games(wrapperGallery);
            display_page_selector();
            console.log(selectPageId);
            history.pushState({ page: selectPageId + 1 }, `Page ${selectPageId + 1}`, `#page-${selectPageId + 1}`);
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

function display_description(game, parent_div){
    const index = find_the_game_json_infos(game.id);

    const description_game = document.createElement('p');
    description_game.innerHTML = jsondata_infos_games[index].description;

    parent_div.appendChild(description_game);
}

function find_the_game_json_infos(id){
    for (let i = 0; i < 2400; i++) {
        if (id == jsondata_infos_games[i].id){
            return i;
        }
    }
}


function display_info_game(game) {
    const backButtonWrapper = document.createElement('div');
    backButtonWrapper.classList.add("bouton_arriere");
    const backButton = document.createElement('button');
    backButton.innerHTML = "<";
    wrapper_parent.appendChild(backButtonWrapper);
    backButtonWrapper.appendChild(backButton);
    backButton.addEventListener('click', function(){
        wrapperPageSelector.innerHTML = "";
        wrapperPageSelector.style.display = "";
        wrapperGallery.style.display = "";
        wrapper_parent.removeChild(wrapperGamePage);
        wrapper_parent.removeChild(backButtonWrapper);
        display_games(wrapperGallery);
        display_page_selector();
    });

    const wrapperGamePage = document.createElement("div");
    wrapperGamePage.classList.add("wrapper_game_page");

    const wrapperTitleGame = document.createElement("div");
    wrapperTitleGame.classList.add("wrapper_title_game");

    const titleGame = document.createElement("div");
    titleGame.classList.add("title_game");

    const imageGame = document.createElement("div");
    imageGame.classList.add("image_game");
    const image = document.createElement("img");
    image.src = game.background_image;
    imageGame.appendChild(image);

    const title = document.createElement("p");
    title.innerHTML = game.name;
    title.style.textAlign = "center";
    title.style.margin = "0";
    titleGame.appendChild(title);

    wrapperTitleGame.appendChild(imageGame);
    wrapperTitleGame.appendChild(titleGame);

    const platforms_rate_game = document.createElement('div');
    platforms_rate_game.classList.add('platforms_rate_game');

    const platformsGame = document.createElement("div");
    platformsGame.classList.add("platforms_game");
    display_platforms_of_one_game(game, platformsGame);

    const all_rates = document.createElement('div');
    all_rates.classList.add('rates_game');
    display_all_rates (game, all_rates);

    const averageGame = document.createElement("div");
    averageGame.classList.add("average_game");
    const averageGame_p = document.createElement('p');
    averageGame_p.innerHTML = calculate_rating(game) + "/100";
    display_rating_color(averageGame_p, calculate_rating(game));

    const synopsisGame = document.createElement("div");
    synopsisGame.classList.add("synopsis_game");

    const descriptionGame = document.createElement("div");
    descriptionGame.classList.add("description_game");
    display_description(game, descriptionGame);

    const typesGame = document.createElement("div");
    typesGame.classList.add("types_game");

    synopsisGame.appendChild(descriptionGame);
    synopsisGame.appendChild(typesGame);

    const videoGame = document.createElement("div");
    videoGame.classList.add("video_game");

    const developpersGame = document.createElement("div");
    developpersGame.classList.add("developpers_game");

    const imagesGame = document.createElement("div");
    imagesGame.classList.add("caroussel_game");

    wrapperGamePage.appendChild(wrapperTitleGame);
    wrapperGamePage.appendChild(platforms_rate_game);
    platforms_rate_game.appendChild(platformsGame);
    platforms_rate_game.appendChild(all_rates);
    platforms_rate_game.appendChild(averageGame);
    averageGame.appendChild(averageGame_p);
    wrapperGamePage.appendChild(synopsisGame);
    wrapperGamePage.appendChild(videoGame);
    wrapperGamePage.appendChild(developpersGame);
    wrapperGamePage.appendChild(imagesGame);

    wrapper_parent.appendChild(wrapperGamePage);
}

function display_games(wrapper) {
    wrapper.innerHTML = "";
    const startIndex = selectPageId * 24;
    const endIndex = startIndex + 24;
    const games = jsondata_games.slice(startIndex, endIndex);
    // console.log(games);

    for (let i = 0; i < games.length; i++){
        const game = games[i];
        // Injecte des div dans le HTML
        const gameElement = document.createElement('div');
        // Ajoute à chaque div la classe .game
        gameElement.classList.add('game');
        // Positionne chaque case dans la grid en utilisant grid-area CSS
        gameElement.style.gridArea = `game${i+1}`;

        gameElement.addEventListener('click', function(){
            wrapperPageSelector.style.display = "none";
            wrapperGallery.style.display = "none";
            display_info_game(game);
        });

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
        display_all_platforms(i, gamePlatform);

        const gameTitle = document.createElement('div');
        gameTitle.classList.add('game_title');
        const Title = document.createElement('p');
        Title.innerHTML = game.name;

        const gameRating = document.createElement('div');
        gameRating.classList.add('rating');
        const rating = document.createElement('p');
        rating.innerHTML = calculate_rating(game);
        display_rating_color(rating, calculate_rating(game));

        // Ajouter les nouveaux éléments div à la galerie
        wrapper.appendChild(gameElement);
        gameElement.appendChild(gameHeader);
        gameElement.appendChild(gameFooter);
        gameFooter.appendChild(gamePlatform);
        gameFooter.appendChild(gameTitle);
        gameFooter.appendChild(gameRating);
        gameHeader.appendChild(Photo);
        gameTitle.appendChild(Title);
        gameRating.appendChild(rating);
    }
}

function display_all_platforms (Index_game, parent_div) {
    const startIndex = selectPageId * 24;
    const endIndex = startIndex + 24;
    const games = jsondata_games.slice(startIndex, endIndex);
    const game = games[Index_game];

    display_platforms_of_one_game(game, parent_div);
}

function display_platforms_of_one_game(game, parent_div) {
    const platforms = game.platforms;
    let array_length = platforms.length;
    for (let i = 0; i < array_length; i++) {
        if (platforms[i].platform.name == "Apple Macintosh" || platforms[i].platform.name == "Linux") {
            // Do nothing
        }
        else {
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
            else if (platforms[i].platform.name == "Web"){
                Platforms.className = 'fab fa-google fa-custom2';
            }
            Platforms.setAttribute("title", platforms[i].platform.name);
            parent_div.appendChild(Platforms);
        }
    }
}


async function catch_list_game() {
    let response = await fetch("data.json");
    const data = await response.json();
    jsondata_games = data;
    return data;
}

async function catch_infos_game(){
    let response = await fetch("stores_data.json");
    const data = await response.json();
    jsondata_infos_games = data;
    return data;
}


catch_list_game().then(() => {
    catch_infos_game().then(() => {
        // console.log(jsondata_infos_games[0].description);
        display_games(wrapperGallery);
        display_page_selector();
    })
});


window.addEventListener("popstate", (event) => {
    var page = event.state && event.state.page ? event.state.page : 1;
    console.log(page);
    selectPageId = page - 1;
    wrapperGallery.style.display = "";
    wrapperPageSelector.style.display = "";
    display_games(wrapperGallery);
    display_page_selector();
});
