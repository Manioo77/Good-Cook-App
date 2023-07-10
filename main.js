const btnSearch = document.querySelector('.container__search--btn')
const inputSearch = document.querySelector('.container__search--input')
const recipes = document.querySelector('.container__recipes')
const containerSearch = document.querySelector('.container__search')

const urlApi = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

const searchRecipe = () => {
	const currentInput = inputSearch.value.trim()
	if (!currentInput) {
		recipes.innerHTML = '<h3 class="error">Input Field cannot be Empty</h3>'
		return
	}

	fetch(`${urlApi}${currentInput}`)
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0]

			if (!meal) {
				recipes.innerHTML = "<h3 class='error'>We don't have such recipe, please try again!</h3>"
				return
			}

			const ingredients = getIngredients(meal)

			const recipeHtml = `
			<div class="mainBox">
                <div class="mainBox__nameRecipe">
                    <h2>${meal.strMeal}</h2>
                    <h4>${meal.strArea}</h4>
                </div>
                <img class="mainBox__imgRecipe" src=${meal.strMealThumb} alt=${meal.strMeal}/>
                <div class="mainBox__ingredients">
                    <h3 class="mainBox__ingredients--h3">Ingriedients:</h3>
                    <ul class="mainBox__ingredients--ul">${ingredients}</ul>
                </div>
                <div class="mainBox__recipe">
                    <button class="mainBox__recipe--btnHide">X</button>
                    <pre class="mainBox__recipe--instructions">
                        ${meal.strInstructions}
                    </pre>
                </div>
				<button class="mainBox__btnShow">View Recipe</button>
			</div>
            `

			recipes.innerHTML = recipeHtml

			const hideRecipeBtn = document.querySelector('.mainBox__recipe--btnHide')
			hideRecipeBtn.addEventListener('click', hideRecipe)
			const showRecipeBtn = document.querySelector('.mainBox__btnShow')
			showRecipeBtn.addEventListener('click', showRecipe)

			containerSearch.style.opacity = '0'
			containerSearch.style.display = 'none'
		})
		.catch(() => {
			containerSearch.style.opacity = '1'
			containerSearch.style.dispay = 'flex'
			recipes.innerHTML = `<h3 class="error">Error fetching data!</h3>`
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
	const recipe = document.querySelector('.mainBox__recipe')
	recipe.style.display = 'none'
}

const showRecipe = () => {
	const recipe = document.querySelector('.mainBox__recipe')
	recipe.style.display = 'block'
}

btnSearch.addEventListener('click', searchRecipe)
inputSearch.addEventListener('keydown', e => {
	if (e.keyCode === 13) {
		searchRecipe()
	}
})
