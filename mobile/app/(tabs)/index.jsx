import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MealAPI } from '../../services/mealAPI';
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import {Ionicons} from '@expo/vector-icons'
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
      setLoading(true);
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured);
    } catch (error) {
      console.log("Error loading the data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/*Welcome Section*/}
        <View style={homeStyles.welcomeSection}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 10,
              textAlign: "center",
              color: COLORS.primary,
              backgroundColor: "#fff",     // white box
              paddingVertical: 8,          // space inside box
              paddingHorizontal: 15,
              borderRadius: 10,            // rounded corners
              overflow: "hidden",          // keep rounded effect
              elevation: 3,                // shadow for Android
              shadowColor: "#000",         // shadow for iOS
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            Welcome To වට්ටෝරුව
          </Text>
        </View>

        {/*Featured Section*/}
        {featuredRecipe && (<View style={homeStyles.featuredSection}>
          <TouchableOpacity
            style={homeStyles.featuredCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
          >
            <View style={homeStyles.featuredImageContainer}>
              <Image
                source={{uri: featuredRecipe.image}}
                style={homeStyles.featuredImage}
                contentFit="cover"
                transition={500} 
              />
              <View style={homeStyles.featuredOverlay}>
                <View style={homeStyles.featuredBadge}>
                  <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                </View>
                <View style={homeStyles.featuredContent}>
                  <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                    {featuredRecipe.title}
                  </Text>
                  <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>
                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.white} />
                          <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                        </View>
                      )}
                    </View>
                </View>
              </View>

            </View>
          </TouchableOpacity>

          </View>)
        }
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
