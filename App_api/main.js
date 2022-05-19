
const pokemonContainer = document.querySelector('.pokemon-container');
const spinnerContainer = document.querySelector('#spinner');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
let allGlobalPokemon = [];

let offset = 1;
let limit = 8;

previous.addEventListener('click', () => {
    if (offset != 1) {
        offset -= 9;
        removeChild(pokemonContainer);
    fetchPokemons(offset, limit)
    }
});

next.addEventListener('click', () => {
    offset += 9;
    removeChild(pokemonContainer);
    fetchPokemons(offset, limit)
});

function fetchPokemon(id) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(res => res.json())
    .then(data => {
        allGlobalPokemon.push(data);
        // console.log(allGlobalPokemon.push(data));
        createPokemon(data);
        // console.log(createPokemon(data));
    });
}

document.addEventListener( "keyup",  e => {
    pokemonContainer.innerHTML = '';
    if (e.target.matches('#inputText')) {
        let pokemonFilter = allGlobalPokemon.filter( (element) => {
            return element.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
        })

        pokemonFilter.forEach((pokemon) => {
           createPokemon(pokemon);
        })
        
    }
}); 

function fetchPokemons(offset, limit) {   
    for (let i = offset; i <= offset + limit; i++) {
        fetchPokemon(i);
    }
}


function createPokemon(pokemon) {
    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    flipCard.appendChild(cardContainer);

    const card = document.createElement('div');
    card.classList.add('pokemon-block');

    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('img-container');

    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default;



    spriteContainer.appendChild(sprite);

    const number = document.createElement('p');
    number.textContent= `#${pokemon.id.toString().padStart(3,0)}`;

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = pokemon.name

    card.appendChild(spriteContainer);
    card.appendChild(number);
    card.appendChild(name);

    const cardBack = document.createElement('div');
    cardBack.classList.add('pokemon-block-back');

    cardBack.appendChild(progressBars(pokemon.stats, pokemon.weight));

    cardContainer.appendChild(card);
    cardContainer.appendChild (cardBack);
    pokemonContainer.appendChild(flipCard);

}

function progressBars(stats, weights) {
    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-container"); //class=""

    for (let i = 0; i < 4; i++) {
        const stat = stats[i]; 
        const weight= weights
        
        const statPercent = stat.base_state / 2 + "%";
        const weightPercent= weight / 2 + "%";
        const statContainer = document.createElement("div");

        const statName = document.createElement('div');
        if(i<3) statName.textContent = stat.stat.name;
        else statName.textContent = "weight";

        const progress = document.createElement('div');
        progress.classList.add("progress");

        const progressBar = document.createElement('div');
        progressBar.classList.add("progress-bar");

        if (i<3) {
            progressBar.setAttribute("aria-valuenow", stat.base_stat);
            progressBar.setAttribute("aria-valuemin", 0);
            progressBar.setAttribute("aria-valuemax", 200);
            progressBar.style.with = statPercent;

            progressBar.textContent = stat.base_stat;
        }else if(i==3){
            progressBar.setAttribute("aria-valuenow", weight);
            progressBar.setAttribute("aria-valuemin", 0);
            progressBar.setAttribute("aria-valuemax", 200);
            progressBar.style.with = weightPercent;

            progressBar.textContent = weight;
        }      

        progress.appendChild(progressBar);
        statContainer.appendChild(statName);
        statContainer.appendChild(progress);
        statsContainer.appendChild(statContainer);
    }
    
    console.log(weights);
    return statsContainer;
}

function removeChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

fetchPokemons(offset, limit);