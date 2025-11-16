import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js';
import { favouritesTable } from './db/schema.js';

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({success: true});
});

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
    console.error("Error adding favourite recipe:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});