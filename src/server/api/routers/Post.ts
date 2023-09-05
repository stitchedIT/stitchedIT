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
        description: z.string(),
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
      const existingPost = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (existingPost) {
        return await ctx.prisma.post.delete({
          where: {
            id: input.postId,
          },
        });
      } else {
        throw new Error("Post not found"); // or handle the case when the post does not exist
      }
    }),
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.comment.create({
        data: {
          postId: input.postId,
          content: input.content,
          userId: input.userId,
        },
      });
    }),
  getCommentsByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        // include: {
        //   user: true,
        // },
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

  bookmarkPost: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, postId } = input;

      // Check if the post is already bookmarked by the user
      const existingBookmark = await ctx.prisma.post.findFirst({
        where: {
          id: postId,
          bookmarkedBy: {
            some: {
              id: userId,
            },
          },
        },
      });

      if (existingBookmark) {
        // If the post is already bookmarked, you can either ignore or unbookmark it.
        // For this example, let's unbookmark it:
        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            bookmarkedBy: {
              disconnect: {
                id: userId,
              },
            },
          },
        });
        return { status: "unbookmarked" };
      } else {
        // If the post is not bookmarked, bookmark it for the user
        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            bookmarkedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return { status: "bookmarked" };
      }
    }),

  // Get all posts
  getAllPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  getBookmarkedPosts: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findMany({
        where: {
          bookmarkedBy: {
            some: {
              id: input.userId,
            },
          },
        },
      });
    }),
  
  getBookmarksByPostId: protectedProcedure
  .input(z.object({
    postId: z.number(),
  }))
  .query(async ({ input, ctx }) => {
    const postWithBookmarks = await ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
      include: {
        bookmarkedBy: true, // Include the users who bookmarked this post
      },
    });

    if (!postWithBookmarks) {
      throw new Error('Post not found');
    }

    return postWithBookmarks.bookmarkedBy; // This will return an array of users who bookmarked the post
  }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        commentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });
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
    //Get likes by post id
    getLikesByPostId: protectedProcedure
    .input(
      z.object({
        postId: z.number(),

      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.likes.findMany({
        where: {
          postId: input.postId,
        },
      });
    })
});
