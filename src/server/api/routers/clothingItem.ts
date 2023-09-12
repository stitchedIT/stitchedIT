import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const clothingItemRouter = createTRPCRouter({
  getRecommendedItems: protectedProcedure
  .input(
    z.object({
      userId: z.string(),
      limit: z.number(),
    })
  )
  .query(async ({ input, ctx }) => {
    // Get items the user has already given feedback on
    const feedbackItems = await ctx.prisma.feedback.findMany({
      where: { userId: input.userId },
      select: { clothingItemId: true },
    });
    const itemIdsWithFeedback = feedbackItems.map(
      (item) => item.clothingItemId
    );

    // Fetch recommended items from the Recommendations table based on a similarity score threshold of 75%
    const recommendedItems = await ctx.prisma.recommendations.findMany({
      where: {
        userId: input.userId,
        similarity_score: {
          gte: "0.75"  // Ensure similarity score is a string and above 75%
        },
        NOT: {
          clothingItemId: {
            in: itemIdsWithFeedback
          }
        }
      },
      take: input.limit,
      include: {
        clothingItem: true  // Include details of the recommended clothing items
      }
    });

    return recommendedItems.map(item => item.clothingItem);  // Return only the clothing item details
  }),

  //get 54 items depedent on user's fav brand and color which will be provided in the input 
  //  
  

  // Add a recommendation
  addFeedback: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        clothingItemId: z.number(),
        feedback: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.feedback.create({
        data: {
          userId: input.userId,
          clothingItemId: input.clothingItemId,
          feedback: input.feedback,
        },
      });
    }),
  // Fetch all feedback
  getAllFeedback: protectedProcedure.query(async ({ ctx }) => {
    const recommendations = await ctx.prisma.feedback.findMany();
    return recommendations;
  }),
});
