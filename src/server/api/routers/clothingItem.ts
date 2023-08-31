import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const clothingItemRouter = createTRPCRouter({
    // Create new clothing item
    addClothingItem: protectedProcedure
        .input(z.object({
            brand: z.string(),
            type: z.string(),
            color: z.optional(z.string()),
            description: z.optional(z.string()),
            imageUrl: z.string(),
            linkUrl: z.optional(z.string()),
        }))
        .mutation(async ({ input, ctx }) => {
            const clothingItem = await ctx.prisma.clothingItem.create({
                data: {
                    ...input,
                },
            });
            return clothingItem;
        }),

    // Add a recommendation
    addRecommendation: protectedProcedure
        .input(z.object({
            userId: z.string(),
            clothingItemId: z.optional(z.number()), 
            feedback: z.string(),
            // If clothingItemId is not provided, we require details to create a new clothing item
            clothingItem: z.optional(
                z.object({
                    brand: z.string(),
                    type: z.string(),
                    color: z.optional(z.string()),
                    description: z.optional(z.string()),
                    imageUrl: z.string(),
                    linkUrl: z.optional(z.string()),
                })
            ),
        }))
        .mutation(async ({ input, ctx }) => {
            let clothingItemId = input.clothingItemId;

            // If clothingItemId is not provided, create a new clothing item first
            if (!clothingItemId && input.clothingItem) {
                const newClothingItem = await ctx.prisma.clothingItem.create({
                    data: {
                        ...input.clothingItem,
                    },
                });
                clothingItemId = newClothingItem.id;
            }

            if (!clothingItemId) {
                throw new Error("Missing clothing item details");
            }

            // Create the recommendation
            const recommendation = await ctx.prisma.recommendation.create({
                data: {
                    userId: input.userId,
                    clothingItemId,
                    feedback: input.feedback,
                },
            });

            return recommendation;
        }),

    // Fetch all recommendations
    getAllRecommendations: protectedProcedure.query(async ({ ctx }) => {
        const recommendations = await ctx.prisma.recommendation.findMany();
        return recommendations;
    }),
});
