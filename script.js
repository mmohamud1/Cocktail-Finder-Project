//DOM elements as functions
const submit = document.querySelector('#submit');
const search = document.querySelector('#search');
const random = document.querySelector('#random');
const cocktailsElement = document.querySelector('#cocktails');
const resultHeading = document.querySelector('#result-heading');
const selectedCocktail = document.querySelector('#selected-cocktail');



// Search for the cocktail by fetching form the api 
const searchCocktail = (e) => {
    // Stop default search settings
    e.preventDefault();

    // Clear any previously searched cocktails
    cocktailsElement.innerHTML = '';
    selectedCocktail.innerHTML = '';

    // Get the search which input by the user
    const searchInput = search.value;
    //console.log(searchInput);

    // Fetch search data from thecocktaildb API
    if(searchInput.trim()) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            // Update the results heading with user search input 
            resultHeading.innerHTML = `<h2>Search results for '${searchInput}':</h2>`;

            // Clear previously search cocktails and update results heading if search input is unavailable 
            if(data.drinks === null) {
                cocktailsElement.innerHTML = '';
                resultHeading.innerHTML = `<h2>There are no results for '${searchInput}'.</h2>`

                // Else display the results from api in UI
            } else {
                cocktailsElement.innerHTML = data.drinks.map(cocktail => `
                <div class="cocktail">
                    <img src="${cocktail.strDrinkThumb}" alt= "${cocktail.strDrink}" />
                    <div class="cocktail-info" data-cocktailID="${cocktail.idDrink}">
                        <h3>${cocktail.strDrink}</h3>
                    </div>
                </div>
                `)
                .join('');
            }    
        });
        // Clear the text in search
        search.value = '';
    } else {
        // If nothing was input in search 
        alert('ENTER A SEARCH TERM!');
    }
}
// Event listener
submit.addEventListener('submit', searchCocktail);



// Get indiviual cocktail information 
const getCocktailInfo = (e) => {

    const cocktailInfo = e.path.find(item => {
        // Find individual cocktail info 
        if(item.classList) {
            return item.classList.contains('cocktail-info');
        } else {
            return false
        }
    });
    // Get the cocktail ID
    if(cocktailInfo) {
        // create a variable for cocktail ID
        const cocktailID = cocktailInfo.getAttribute('data-cocktailID');
        //console.log(cocktailID);
        getCocktailById(cocktailID);
    }
}
// Event listener
cocktailsElement.addEventListener('click', getCocktailInfo);



// Get cocktails by ID using API
const getCocktailById = (cocktailID) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailID}`)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        const cocktail = data.drinks[0];
        addSelectedCocktailToDOM(cocktail);
    });
}



// Add the selected cocktail information to DOM
const addSelectedCocktailToDOM = (cocktail) => {
    const ingredients = [];

    // loop through the ingredients in api up to 15 if an ingredient and measurement is available add to array if not break loop
    for (let i = 1; i <= 15; i++) {
        if(cocktail[`strIngredient${i}`]) {
            // push avail ingredient and measurement to array
            ingredients.push(`${cocktail[`strIngredient${i}`]} - ${cocktail[`strMeasure${i}`]}`);
        } else {
            // break if there is no ingredient or measurement
            break;
        }
    }
    // remove list of all cocktails from DOM
    cocktailsElement.innerHTML = '';
    // Add  selected cocktail information to DOM
    selectedCocktail.innerHTML = `
    <div class="selected-cocktail">
      <h1>${cocktail.strDrink}</h1>
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
      <div class="selected-cocktail-info">
        ${cocktail.strCategory ? `<p>${cocktail.strCategory}</p>` : ''}
        ${cocktail.strAlcoholic ? `<p>${cocktail.strAlcoholic}</p>` : ''}
      </div>
      <div class="main">
        <p>${cocktail.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ingredientMeasurement => `<li>${ingredientMeasurement}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}



// Get random cocktail from API
const getRandomCocktail = () => {
    // clear DOM
    cocktailsElement.innerHTML = '';
    resultHeading.innerHTML = `<h2>Random Cocktail:</h2>`;

    // random coctail finder
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        const randomCocktail = data.drinks[0];

        addSelectedCocktailToDOM(randomCocktail);
    })
}
// Event listener
random.addEventListener('click', getRandomCocktail);