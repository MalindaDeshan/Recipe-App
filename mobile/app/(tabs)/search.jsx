import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MealAPI } from '../../services/mealAPI';
import { useDebounce } from '../../hooks/useDebounce';


const SearchScreen = () => {

  const [searchQuery,setSearchQuery] = useState("");
  const [recipes,setRecipes] = useState([]);
  const [loading,setLoading] = useState(false);
  const [initialLoading,setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery,300);

  const performSearch = async(query) => {
    //When there is no nearch query
    if(!query.trim()){
      const randomMeals =await MealAPI.getRandomMeals(12)
      return randomMeals.map(meal => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
    }

    //search by name first, then by ingredient

    const nameResult = await MealAPI.searchMealsByName(query);
    let results = nameResult;

    if(results.length === 0){
      const ingedientResult = await MealAPI.filterByIngredient(query);
      results= ingedientResult
    }

    return results.slice(0.12).map(meal => MealAPI.transformMealData(meal)).filter((meal) => meal !== null )
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results =await performSearch("")
        setRecipes(results)
      } catch (error) {
        console.error("Error loading initial data: ",error);
        
      } finally {
        setInitialLoading(false);

      }
    };
    loadInitialData()
  },[])

  useEffect(() => {
    if(initialLoading) return; 
    const habdleSearch = async () => {
      setLoading(true);
    } 

  },[debouncedSearchQuery,initialLoading])


  return (
    <View>
      <Text>search</Text>
    </View>
  )
}

export default SearchScreen