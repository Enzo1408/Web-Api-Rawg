let jsondata_games = {};
let jsondata_infos_games = {};
let selectPageId = 0;
let state = 0; // 0 for home, 1 for game infos
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


function display_page_selector(Page) {
    const pageSelector = document.querySelector(".page_select");
    // pageSelector.innerHTML = "";

    const start = Math.max(1, Page - 3);
    const end = Math.min(Page + 5, 99);

    const createButton = (pageNum) => {
        const btnPage = document.createElement("button");
        btnPage.innerHTML = pageNum;
        if (pageNum === Page + 1) {
            btnPage.style.borderBottom = "2px solid white";
        }
        btnPage.addEventListener("click", () => {
            Page = pageNum - 1;
            delete_wrapperGallery_pageSelector(wrapper_parent);
            recreate_wrapperGallery_pageSelector(Page + 1);
            console.log("Page = " + (Page + 1) + ", State = 0");
            history.pushState({ page: Page + 1, x: 0 }, `Page ${Page + 1}`, `#page-${Page + 1}`);
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

function display_types(game, parent_div) {
    const types_game = document.createElement('p');
    let str = "";

    for (let genres of game.genres) {
        let emoji;
        if (genres.name == "Action") {
            emoji = "\u2694\uFE0F";
        } else if (genres.name == "Adventure") {
            emoji = "\uD83D\uDC09";
        } else if (genres.name == "RPG") {
            emoji = "\uD83E\uDDD9";
        } else if (genres.name == "Shooter") {
            emoji = "\uD83C\uDFAF";
        } else if (genres.name == "Puzzle") {
            emoji = "\uD83E\uDDE9";
        } else if (genres.name == "Indie") {
            emoji = "\uD83D\uDD79\uFE0F";
        } else if (genres.name == "Sports") {
            emoji = "\uD83C\uDFC5";
        } else if (genres.name == "Racing") {
            emoji = "\uD83C\uDFCE\uFE0F";
        } else if (genres.name == "Platformer") {
            emoji = "\u265F\uFE0F";
        }
        
        str = str + emoji + " " + genres.name + " "  + emoji + "<br>";
    }
    
    types_game.innerHTML = str;
    types_game.style.fontSize = "20px";
    types_game.style.margin = "5px 0px 5px 0px";
    parent_div.appendChild(types_game);
}

function find_the_game_json_infos(id){
    for (let i = 0; i < 2400; i++) {
        if (id == jsondata_infos_games[i].id){
            return i;
        }
    }
}

function display_text_stores(game, parent_div){
    let str = "";
    for (let store of game.stores){
        const stores_game = document.createElement('p');
        const link = document.createElement('a');
        link.href = "https://" + store.store.domain;
        link.target = '_blank';
        str = store.store.name + " &#8594;";
        stores_game.innerHTML = str;
        stores_game.setAttribute("title", link.href);
        parent_div.appendChild(link);
        link.appendChild(stores_game);
    }
}

function display_text_developers(game, parent_div) {
    const index = find_the_game_json_infos(game.id);
    let str = "";

    for (let dev of jsondata_infos_games[index].developers) {
        const dev_name = document.createElement('p');
        str = dev.name;
        dev_name.innerHTML = str;
        dev_name.classList.add("text_developpers")
        parent_div.appendChild(dev_name);
    }
}


function display_info_game(game) {
    const wrapperGamePage = document.createElement("div");

    if (window.innerWidth < 826){
        wrapperGamePage.classList.add("wrapper_game_page_mobile");
    }
    else{
        wrapperGamePage.classList.add("wrapper_game_page");
    }

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
    const TitleDescription = document.createElement("div");
    TitleDescription.classList.add("title_description");
    TitleDescription.style.fontSize = "25px";
    const TextTitleDescription = document.createElement('p');
    TextTitleDescription.innerHTML = "Description";
    const TextDescription = document.createElement("div");
    TextDescription.classList.add("text_description");
    display_description(game, TextDescription);

    const DevStores = document.createElement("div");
    DevStores.classList.add("dev_stores");

    const Types = document.createElement("div");
    Types.classList.add("types_game");
    const TitleTypes = document.createElement("div");
    TitleTypes.innerHTML = "Genres \uD83D\uDEA9";
    TitleTypes.classList.add("title_types");
    TitleTypes.style.fontSize = "25px";
    const TextTypes = document.createElement("div");
    TextTypes.classList.add("text_types");
    display_types(game, TextTypes);

    const Stores = document.createElement("div");
    Stores.classList.add("stores");
    const Dev = document.createElement("div");
    Dev.classList.add("developers");

    const TitleStores = document.createElement("div");
    TitleStores.classList.add("title_stores");
    TitleStores.innerHTML = "Stores \uD83D\uDED2";
    TitleStores.style.color = "white";
    TitleStores.style.fontSize = "25px";
    const TextStores = document.createElement("div");
    TextStores.classList.add("text_stores");
    display_text_stores(game, TextStores);

    const TitleDev = document.createElement("div");
    TitleDev.classList.add("title_developers");
    TitleDev.innerHTML = "Developers \uD83D\uDC68\uD83C\uDFFB\u200D\uD83D\uDCBB";
    TitleDev.style.color = "white";
    TitleDev.style.fontSize = "25px";
    const TextDev = document.createElement("div");
    TextDev.classList.add("text_developers");
    TextDev.classList.add("text_dev");
    // display TextDev_p.... parent = TextDev
    display_text_developers(game, TextDev);


    const imagesGame = document.createElement("div");
    imagesGame.classList.add("caroussel_game");

    wrapperGamePage.appendChild(wrapperTitleGame);
    wrapperGamePage.appendChild(platforms_rate_game);
    platforms_rate_game.appendChild(platformsGame);
    platforms_rate_game.appendChild(all_rates);
    platforms_rate_game.appendChild(averageGame);
    averageGame.appendChild(averageGame_p);
    wrapperGamePage.appendChild(synopsisGame);
    synopsisGame.appendChild(descriptionGame);
    descriptionGame.appendChild(TitleDescription);
    descriptionGame.appendChild(TextTitleDescription);
    descriptionGame.appendChild(TextDescription);
    TitleDescription.appendChild(TextTitleDescription);
    DevStores.appendChild(Types);
    Types.appendChild(TitleTypes);
    Types.appendChild(TextTypes);
    wrapperGamePage.appendChild(DevStores);
    DevStores.appendChild(Stores);
    DevStores.appendChild(Dev);
    Stores.appendChild(TitleStores);
    Stores.appendChild(TextStores);
    Dev.appendChild(TitleDev);
    Dev.appendChild(TextDev);
    wrapperGamePage.appendChild(imagesGame);

    wrapper_parent.appendChild(wrapperGamePage);
}

function display_games(wrapper, page) {
    // wrapper.innerHTML = "";
    const startIndex = page * 24;
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

        gameElement.addEventListener('click', function(){
            delete_wrapperGallery_pageSelector(wrapper_parent);
            history.pushState({ page: -1, x: 1, g: game}, '', '');
            console.log("page = -1, x = 1");
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
        display_all_platforms(i, gamePlatform, page);

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

function display_all_platforms (Index_game, parent_div, page) {
    const startIndex = page * 24;
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

function delete_wrapperGallery_pageSelector(parent_div) {
    const gallery = document.querySelector('.wrapper-gallery');
    const pageSel = document.querySelector('.page_select');
    parent_div.removeChild(gallery);
    parent_div.removeChild(pageSel);
}

function recreate_wrapperGallery_pageSelector(page) {
    const wrapperGallery = document.createElement('div');
    wrapperGallery.classList.add("wrapper-gallery");
    wrapper_parent.appendChild(wrapperGallery);

    const pageSel = document.createElement('div');
    pageSel.classList.add("page_select");
    wrapper_parent.appendChild(pageSel);

    console.log("PAGE AFFICHE = " + page);

    display_games(wrapperGallery, page - 1);
    display_page_selector(page - 1);
}

function delete_game_info() {
    const infos = document.querySelector('.wrapper_game_page');
    wrapper_parent.removeChild(infos);
}

function recreate_game_info(game) {
    display_info_game(game);
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
        console.log(jsondata_infos_games);
        console.log(jsondata_games);
        history.pushState({page: 1, x: 0}, '', '');
        console.log("page = 1, x = 0");
        display_games(wrapperGallery, 0);
        display_page_selector(0);
    })
});


window.addEventListener("popstate", (event) => {
    var page = event.state ? event.state.page : undefined;
    var x = event.state ? event.state.x : undefined;
    var g = event.state ? event.state.g : undefined;
    console.log("page = " + page + "state = " + x);
    const GamePage = document.querySelector('.wrapper_game_page');
    const ButtonBack = document.querySelector('.bouton_arriere');
    const gallery = document.querySelector('.wrapper-gallery');
    const selector = document.querySelector('.page_select');
    if (x == 1) {
        if (GamePage && ButtonBack){
            delete_wrapperGallery_pageSelector(wrapper_parent);
            delete_game_info();
            recreate_game_info(g);
        }
        else {
            delete_wrapperGallery_pageSelector(wrapper_parent);
            recreate_game_info(g);
        }
    }
    if (x == 0) {
        if (gallery && selector){
            delete_wrapperGallery_pageSelector(wrapper_parent);
            recreate_wrapperGallery_pageSelector(page);
        }
        else {
            delete_game_info();
            recreate_wrapperGallery_pageSelector(page);
        }
    }
});





/* if (state == 1){
        wrapperGallery.style.display = "none";
        wrapperPageSelector.style.display = "none";
        state = 0;
    }
    if (state == 0) {
        var page = event.state && event.state.page ? event.state.page : 1;
        console.log(page, "ok");
        selectPageId = page - 1;
        const wrapperGamePage_ = document.querySelector('.wrapper_game_page');
        const wrapperButtonBack = document.querySelector('.bouton_arriere');
        wrapperGallery.style.display = "";
        wrapperPageSelector.style.display = "";
        wrapper_parent.removeChild(wrapperGamePage_);
        wrapper_parent.removeChild(wrapperButtonBack);
        display_games(wrapperGallery);
        display_page_selector();
    } */
