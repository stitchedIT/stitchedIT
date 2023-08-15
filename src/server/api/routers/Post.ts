import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Add a post
  addPost: protectedProcedure
    .input(z.object({
      userId: z.string(),
      description: z.string().optional(),
      brandTags: z.array(z.string()),
      imageUrl: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.post.create({
        data: {
          userId: input.userId,
          description: input.description,
          brandTags: input.brandTags,
          imageUrl: input.imageUrl,
          likesCount: 0,
        },
      });
    }),

  // Get all posts
  getAllPosts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  // Get a specific post
  getPostById: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({ where: { id: input.postId } });
    }),
});

