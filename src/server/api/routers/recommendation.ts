import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";


// model ClothingItem {
//     id              Int              @id @default(autoincrement())
//     brand           String
//     type            String
//     color           String?
//     description     String?
//     imageUrl        String
//     linkUrl         String?
//     recommendations Recommendation[]
//     wishedBy        User[]           @relation("UserWishlist")
//     createdAt       DateTime         @default(now())
//   }

//   model Recommendation {
//     id             Int          @id @default(autoincrement())
//     userId         String
//     user           User         @relation(fields: [userId], references: [id])
//     clothingItemId Int
//     clothingItem   ClothingItem @relation(fields: [clothingItemId], references: [id])
//     feedback       String
//     createdAt      DateTime     @default(now())
//   }

export const recommendationRouter = createTRPCRouter({
    recommendationAdd: protectedProcedure
        .input(z.object({
            userId: z.string(),
            clothingItemId: z.number(),
            feedback: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const recommendation = await ctx.prisma.recommendation.create({
                data: {
                    userId: input.userId,
                    clothingItemId: input.clothingItemId,
                    feedback: input.feedback,
                },
            });
            return recommendation;
        }),
    recommendationGetAll: protectedProcedure.query(async ({ ctx }) => {
        const recommendations = await ctx.prisma.recommendation.findMany();
        return recommendations;
    }),




});

