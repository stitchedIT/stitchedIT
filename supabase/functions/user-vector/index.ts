// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const url = "https://xwhmshfqmtdtneasprwx.supabase.co";

const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aG1zaGZxbXRkdG5lYXNwcnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTA3MTc5NCwiZXhwIjoyMDA2NjQ3Nzk0fQ.SRkt4dELsGdzTfJ70wQ1m7zOiKcvwZc0iNEYbfKjxIY";

const supabase = createClient(url, key);

console.log("Hello from Functions!");

serve(
  async (req: {
    method: string;
    json: () => PromiseLike<{ userId: any }> | { userId: any };
  }) => {
    if (req.method === "OPTIONS") {
      // Preflight request. Reply successfully:
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    try {
      const { userId } = await req.json();

      if (!userId) {
        throw new Error("User ID is required");
      }

      const userFeedback = await getUserFeedback(userId);

      let userProfileVector = await calculateUserProfileVector(userFeedback);

      await updateUserProfileVectorInDB(userId, userProfileVector);
      
      const recommendations = await getRecommendations(
        userProfileVector,
        userId
      );

      return new Response(JSON.stringify({ data: recommendations }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
);

async function getUserFeedback(userId: any) {
  try {
    let { data, error } = await supabase
      .from("Feedback")
      .select("*")
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateUserProfileVectorInDB(
  userId: string,
  profileVector: number[]
) {
  try {
    // Update the profile_vector for the specified user in the User table
    const { data, error } = await supabase
      .from("User")
      .update({ profile_vector: profileVector })
      .eq("id", userId);

    if (error) throw error;

    console.log(`Successfully updated profile vector for user ${userId}`);
    return data;
  } catch (error) {
    console.error(`Failed to update profile vector for user ${userId}:`, error);
    throw error;
  }
}

async function calculateUserProfileVector(feedbackData: any[]) {
  try {
    // Step 1: Fetch the vector representations of all clothing items involved
    const itemIds = feedbackData.map(
      (feedback: { clothingItemId: any }) => feedback.clothingItemId
    );
    const { data: itemVectors, error } = await supabase
      .from("ClothingItem")
      .select("id, embed")
      .in("id", itemIds);

    if (error) throw error;

    // Step 2 & 3: Aggregate the vectors based on the feedback with time decay
    let userProfileVector = new Array(NUMBER_OF_VECTOR_DIMENSIONS).fill(0);
    const now = Date.now();

    for (const feedback of feedbackData) {
      let itemVector = itemVectors.find(
        (item: { id: any }) => item.id === feedback.clothingItemId
      ).embed;

      if (typeof itemVector === "string") {
        itemVector = JSON.parse(itemVector).map(Number);
      }

      const feedbackTime = new Date(feedback.createdAt).getTime();
      const timeDecayFactor = Math.exp(-ALPHA * (now - feedbackTime)); // Exponential decay

      if (feedback.feedback === "like") {
        userProfileVector = userProfileVector.map(
          (value, index) => value + timeDecayFactor * itemVector[index]
        );
      } else if (feedback.feedback === "dislike") {
        userProfileVector = userProfileVector.map(
          (value, index) => value - timeDecayFactor * itemVector[index]
        );
      }
    }

    // Step 4: Normalize the user profile vector 
    const vectorMagnitude = Math.sqrt(
      userProfileVector.reduce((sum, value) => sum + value ** 2, 0)
    );

    if (vectorMagnitude !== 0) {
      userProfileVector = userProfileVector.map(
        (value) => value / vectorMagnitude
      );
    }

    return userProfileVector;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const NUMBER_OF_VECTOR_DIMENSIONS = 65; /* Your vector dimension */
const ALPHA = 0.5; /* Your decay parameter */

async function getRecommendations(userProfileVector: any, userId: string) {
  try {
    // Fetch IDs of items for which the user has already provided feedback
    const { data: userFeedbackData, error: userFeedbackError } = await supabase
      .from("Feedback")
      .select("clothingItemId")
      .eq("userId", userId);

    if (userFeedbackError) throw userFeedbackError;

    const itemIdsWithFeedback = userFeedbackData.map(
      (feedback) => feedback.clothingItemId
    );

    
    // Fetch all clothing item vectors from the database
    const { data: clothingItemVectors, error } = await supabase
      .from("ClothingItem")
      .select("id, embed")


    if (error) throw error;

    const unreviewedItemVectors = clothingItemVectors.filter(
      (item) => !itemIdsWithFeedback.includes(item.id)
    );

    // Calculate the cosine similarity between the userProfileVector and each item vector
    const similarities = unreviewedItemVectors.map((item) => {
      return {
        itemId: item.id,
        similarity: cosineSimilarity(userProfileVector, item.embed),
      };
    });

    // Sort the items by similarity in descending order to get the top recommendations
    const topRecommendations = similarities
    .filter((rec) => rec.similarity >= 0.65 && rec.similarity <= 0.99) // Keep only records with similarity between 65% and 85%
    .sort((a, b) => b.similarity - a.similarity) // Sort them in descending order of similarity
    .slice(0, 6); // Get the top 3 recommendations


    // Insert the top recommendations into the Recommendations table
    const recommendationsToInsert = topRecommendations.map((rec) => ({
      userId: userId,
      clothingItemId: rec.itemId,
      similarity_score: rec.similarity,
    }));

    const { error: insertError } = await supabase
      .from("Recommendations")
      .insert(recommendationsToInsert);

    if (insertError) throw insertError;

    return topRecommendations;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function cosineSimilarity(vectorA: any, vectorB: any): number {
  // Ensure vectorB is an array of numbers
  console.log(vectorA,"vectorA")
  if (typeof vectorA === "string") {
    try {
      vectorB = JSON.parse(vectorA).map(Number);
    } catch (e) {
      throw new Error("Failed to parse vectorA to a number array");
    }
  }

  if (typeof vectorB === "string") {
    try {
      vectorB = JSON.parse(vectorB).map(Number);
    } catch (e) {
      throw new Error("Failed to parse vectorB to a number array");
    }
  }
  if (!Array.isArray(vectorA) || vectorA.some(isNaN)) {
    throw new Error("vectorA is not a valid number array");
  }
  // Check if vectorB is now a valid array
  if (!Array.isArray(vectorB) || vectorB.some(isNaN)) {
    throw new Error("vectorB is not a valid number array");
  }

 
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return Math.min(1, Math.max(-1, dotProduct / (magnitudeA * magnitudeB)));

}
