import { View, Text, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '../../constants/api'
import { MealAPI } from '../../services/mealAPI'
import LoadingSpinner from '../../components/LoadingSpinner'
import {recipeDetailStyles} from "../../assets/styles/recipe-detail.styles"

const RecipeDetailsScreen = () => {

    const {id:recipeId} = useLocalSearchParams()
    const [recipe,setRecipe] = useState(null);
    const [loading,setLoading] = useState(true);
    const [isSaved,setIsSaved] = useState(false);
    const [isSaving,setIsSaving] = useState(false);

    const {user} = useUser();
    const userId = user?.id;

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const response = await fetch(`${API_URL}/favorites/${userId}`);
                const favorites =  await response.json();
                const isRecipeSaved = favorites.some((fav) => fav.recipeId === parseInt(recipeId));
                setIsSaved(isRecipeSaved)
            } catch (error) {
                console.error("Error checking if recipe is saved: ",error);
            }
        }
        const loadRecipeDetail = async () => {
            setLoading(true)
            try {
                const mealData = await MealAPI.getMealById(recipeId);
                if(mealData){
                    const transformRecipe = MealAPI.transformMealData(mealData);

                    const reciprWithVideo = {
                        ...transformRecipe,
                        youtubeUrl : mealData.strYoutube || null
                    };

                    setRecipe(reciprWithVideo);
                }
            } catch (error) {
                console.error("Error loading recipe details: ",error);
            } finally {
                setLoading(false)
            }
        };

        checkIfSaved();
        loadRecipeDetail();
    },[recipeId,userId]);

    const getYoutubeEmberUrl = (url) => {
        const videoId=url.split("v=")[1]
        return `https://www.youtube.com/embed/${videoId}`
    } ;

    const handleToggleSave = async () => {
        setIsSaving(true)

        try {
            if(isSaved){
                //remove from favorites
                const response = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`,{method : "DELETE",})
                if(!response.ok) throw new Error("Failed to remove recipe")
                setIsSaved(false)
            }else {
                //add to favorites
                const response = await fetch(`${API_URL}/favorites`,{method:"POST",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body:JSON.stringify({
                        userId,
                        recipeId:parseInt(recipeId),
                        title : recipe.title,
                        image:recipe.image,
                        cookTime : recipe.cookTime,
                        servings: recipe.servings,
                    }),
                });

                if(!response.ok) throw new Error("Failed to ave recipe")
                setIsSaved(true)
            }
        } catch (error) {
            console.error("Error toggling recipe save: ",error);
            Alert.alert("Error", `Something went worng,Please try again.`)
            
        } finally {
            setIsSaving(false);
        }
    };

    if(loading) return <LoadingSpinner message="Loading Recipe Details..."/>


  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/*Header*/}
      </ScrollView>
    </View>
  )
}

export default RecipeDetailsScreen