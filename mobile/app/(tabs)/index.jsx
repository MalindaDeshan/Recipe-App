import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { MealAPI } from '../../services/mealAPI';

const HomeScreen = () => {

    const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true)
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all ([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ])

      const transformedCategories = apiCategories.map((cat,index) => ({
        id: index+1,
        name:cat.strCategory,
        image:cat.strCategoryThumb,
        description:cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      const transformedMeals = randomMeals.map(meal => MealAPI.transformMealData(meal)).filter((meal) => meal !== null );

      setRecipes(transformedMeals)

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);

      setFeaturedRecipe(transformedFeatured);


    } catch (error) {
      console.log("Error loading the data",error);
    } finally {
      setLoading(false)
    }
  }
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen;