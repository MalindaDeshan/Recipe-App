import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MealAPI } from '../../services/mealAPI';
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import {Ionicons} from '@expo/vector-icons'
import CategoryFilter from '../../components/CategoryFilter';
import RecipeCard from '../../components/RecipeCard';
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

      if(!selectedCategory) setSelectedCategory(transformedCategories[0].name)

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

  const handleCategorySelect = async (categoryName) => {
  setSelectedCategory(categoryName);
  try {
    const meals = await MealAPI.filterByCategories(categoryName);
    const transformedMeals = meals
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
    setRecipes(transformedMeals);
  } catch (error) {
    console.log("Error loading category data", error);
    setRecipes([]);
  }
};

const onRefresh =async () => {
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
}


  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/*Welcome Section*/}
        <View style={homeStyles.welcomeSection}>
       <View
          style={{
            marginTop: 5,
            backgroundColor: COLORS.background,
            borderRadius: 10,
            overflow: "hidden",
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.10,
            shadowRadius: 4,
            shadowOffset: { width: 4, height: 10 },
            alignItems: "center"
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{
              width: 320,       // required
              height: 100,      // required
              borderRadius: 10,
              alignSelf: "center", // optional (centers image)
            }}
            resizeMode="contain"
  />
</View>

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

        {/*Categories Section*/}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <View
         style={homeStyles.recipesSection}
        >
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
              // ListEmptyComponent={}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>Try a different category</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
