import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favouritesTable } from './db/schema.js';
import { and, eq } from 'drizzle-orm';

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({success: true});
});

//Add a recipe to database
app.post("/api/favourites", async(req, res) => {
  try {
    const {userId, recipeId, title, image, cookTime, servings} = req.body;
    
    if(!userId || !recipeId || !title) {
      return res.status(400).json({error: "Missing required fields"});
    }

    const newFavourite = await db.insert(favouritesTable).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
    }).returning();

    res.status(201).json(newFavourite[0]);

  } catch (error) {
    console.error("Error adding a favourite recipe:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

//Fetch all favourite recipes for a user
app.get("/api/favourites/:userId", async(req, res) => {
  try {
    const {userId} =req.params

    const userFavorites = await db.select().from(favouritesTable).where(eq(favouritesTable.userId,userId));

    res.status(200).json(userFavorites);

  } catch (error) {
    console.error("Error fetching a favourite recipe:", error);
    res.status(500).json({error: "Internal server error"});
  }
})

//Delete a recipe from database
app.delete("/api/favourites/:userId/:recipeId", async(req, res) => {
  try {
    const {userId, recipeId} = req.params;
    await db.delete(favouritesTable).where(
      and(eq(favouritesTable.userId,userId),eq(favouritesTable.recipeId,parseInt(recipeId)))
    )

    res.status(200).json({message: "Favourite recipe removed successfully"});
  } catch (error) {
    console.error("Error removing a favourite recipe:", error);
    res.status(500).json({error: "Internal server error"});
  }
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});