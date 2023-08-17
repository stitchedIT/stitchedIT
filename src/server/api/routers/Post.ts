import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Add a post
  addPost: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        description: z.string().optional(),
        brandTags: z.array(z.string()),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.create({
        data: {
          userId: input.userId,
          description: input.description,
          brandTags: input.brandTags,
          imageUrl: input.imageUrl,
          likesCount: 0,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),

  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        description: z.string().optional(),
        brandTags: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          description: input.description,
          brandTags: input.brandTags,
        },
      });
    }),












  // Get all posts
  getAllPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getAllPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),

  // Create a toggleLike procedure that is going to take in the userId and postId. If there is no existing like, we want to create that like and add to the post tables likecount, otherwise, we want to delete that like and decrease likecount in the post table.

  toggleLike: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, postId } = input;

      // Check if the user has already liked the post
      const existingLike = await ctx.prisma.likes.findFirst({
        where: {
          userId,
          postId,
        },
      });

      if (existingLike) {
        // If the user has already liked the post, delete the like and decrease the like count
        await ctx.prisma.likes.delete({
          where: {
            id: existingLike.id,
          },
        });

        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        });
      } else {
        // If the user has not liked the post, create a new like and increase the like count
        await ctx.prisma.likes.create({
          data: {
            userId,
            postId,
          },
        });

        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        });
      }

      return true;
    }),
});
