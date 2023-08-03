import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [recipes, setRecipes] = useState(() => new Set<Recipe>());
  const [fetchedRecipes, setFetchedRecipes] = useState<{[key: string]: Recipe[];}>({});

  type Category = {
    idCategory: number,
    strCategory: string
  }

  type Recipe = {
    strMeal: string,
    strMealThumb: string,
    idMeal: number
  }

  const fetchCategories = () => {
    fetch('https://themealdb.com/api/json/v1/1/categories.php')
    .then(res => res.json())
    .then(res => {
      setCategories(res.categories);
    })
  }

  useEffect(() => {
    fetchCategories();
  },[])

  const fetchMeals = async (toggledCategories: string[]) => {
    const recipes = new Set<Recipe>();

    for (const enabledCategory of toggledCategories) {

      console.log(enabledCategory);
      if (fetchedRecipes[enabledCategory]) {
        for (const recipe of fetchedRecipes[enabledCategory]) {
          recipes.add(recipe);
        }
      } else {
        await fetch("https://themealdb.com/api/json/v1/1/filter.php?c=" + enabledCategory)
          .then((res) => res.json())
          .then((data) => data["meals"])
          .then((data: Recipe[]) => {
            setFetchedRecipes({ ...fetchedRecipes, enabledCategory: data });
            for (const recipe of data) {
              recipes.add(recipe);
            }
          });
      }
    }

    setRecipes(recipes);
  }

  const updateCategory = async (category: Category) => {
    const included = selectedCategories.includes(category.strCategory);
    var updatedCategories: string[] = [];

    if (included) {
      updatedCategories = selectedCategories.filter(item => item != category.strCategory);
    } else {
      
      updatedCategories = [...selectedCategories, category.strCategory];
    }

    setSelectedCategories(updatedCategories);
    await fetchMeals(updatedCategories);
  }

  const isSelectedCategory = (category: Category) => {
    return selectedCategories.includes(category.strCategory);
  }

  return (
    <>
          <h3>Select a category</h3>
      <div className='category-selector'>
            {categories 
            && categories.map((category: Category) => (
            <div className = "category-buttons" key={category.idCategory}> 
              <button className = {isSelectedCategory(category) ? 'enabled' : 'disabled'} onClick={() => updateCategory(category)}>{category.strCategory}</button>
            </div>
          ))}
      </div>

      <div className="recipe">
        {Array.from(recipes.values()).map((recipe) => (
          <div className="recipe-image">
            <img src={recipe.strMealThumb}></img>
            <p>{recipe.strMeal}</p>
          </div>
        ))}
        <div>

        </div>
      </div>
    </>
  )
}

export default App
