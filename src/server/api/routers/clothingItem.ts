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
        offset: z.number().default(0),
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

      // Fetch items not yet shown to the user, based on some recommendation logic
      // For simplicity, we're just avoiding items they've already seen
      const recommendedItems = await ctx.prisma.clothingItem.findMany({
        where: {
          NOT: { id: { in: itemIdsWithFeedback } },
        },
        take: input.limit,
        skip: input.offset, // Add this line
        // Optionally, add more ordering logic based on other recommendation criteria
      });

      return recommendedItems;
    }),

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
