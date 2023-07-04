const btnSearch = document.querySelector('.container__search--btn')
const inputSearch = document.querySelector('.container__search--input')
const recipes = document.querySelector('.container__recipes')
const containerSearch = document.querySelector('.container__search')

const urlApi = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

const searchRecipe = () => {
	const currentInput = inputSearch.value.trim()
	if (!currentInput) {
		recipes.innerHTML = `<h3>Input Field cannot be Empty</h3>`
		return
	}

	fetch(`${urlApi}${currentInput}`)
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0]

			if (!meal) {
				recipes.innerHTML = `
                <h3>We don't have such recipe, please try again!</h3>
                `
				return
			}

			const ingredients = getIngredients(meal)

			const recipeHtml = `
                <div class="nameRecipe">
                    <h2>${meal.strMeal}</h2>
                    <h4>${meal.strArea}</h4>
                </div>
                <img src=${meal.strMealThumb} alt=${meal.strMeal}/>
                <div class="containerIngredients">
                    <h3>Ingriedients:</h3>
                    <ul>${ingredients}</ul>
                </div>
                <div id="recipe">
                    <button id="hide-recipe">X</button>
                    <pre id="instructions">
                        ${meal.strInstructions}
                    </pre>
                </div>
                <button id="show-recipe">View Recipe</button>
            `

			recipes.innerHTML = recipeHtml

			const hideRecipeBtn = document.getElementById('hide-recipe')
			hideRecipeBtn.addEventListener('click', hideRecipe)
			const showRecipeBtn = document.getElementById('show-recipe')
			showRecipeBtn.addEventListener('click', showRecipe)

			containerSearch.style.opacity = '0'
			containerSearch.style.display = 'none'
		})
		.catch(() => {
			containerSearch.style.opacity = '1'
			containerSearch.style.dispay = 'flex'
			recipes.innerHTML = `<h3>Error fetching data!</h3>`
		})
}

const getIngredients = meal => {
	let ingredientsHtml = ''
	for (let i = 1; i <= 20; i++) {
		const ingredient = meal[`strIngredient${i}`]
		if (ingredient) {
			const measure = meal[`strMeasure${i}`]
			ingredientsHtml += `<li>${measure} ${ingredient}</li>`
		} else {
			break
		}
	}
	return ingredientsHtml
}

const hideRecipe = () => {
	const recipe = document.getElementById('recipe')
	recipe.style.display = 'none'
}

const showRecipe = () => {
	const recipe = document.getElementById('recipe')
	recipe.style.display = 'block'
}

btnSearch.addEventListener('click', searchRecipe)
inputSearch.addEventListener('keydown', e => {
	if (e.keyCode === 13) {
		e.preventDefault()
		searchRecipe()
	}
})
