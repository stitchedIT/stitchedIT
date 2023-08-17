import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  getCommentsByPostId: publicProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { postId } = input;

      return await ctx.prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          user: true,
        },
      });
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { content, postId } = input;

      return await ctx.prisma.comment.create({
        data: {
          content,
          postId,
          userId: ctx.session.user.id,
        },
        include: {
          user: true,
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId } = input;

      return await ctx.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    }),
});