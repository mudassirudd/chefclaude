import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import {  getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        []
    )
    const [recipe, setRecipe] = React.useState("")
    const [isLoading,setisloading ] = React.useState(false)

    async function getRecipe() {
        setisloading(true)
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeMarkdown)
        if (recipeMarkdown) {
            setisloading(false)
            
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
           { ingredients.length<4 &&  <p style={{textAlign:"center"}}>{`Please add  ${4- ingredients.length} more`}.</p>}

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

                {isLoading && <small>Loading... the chef takes about 45s</small>}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}