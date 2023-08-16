import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const bcrypt = require("bcryptjs");



export const userRouter = createTRPCRouter({
  addUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        fullName: z.string(),
        userName: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      return await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.fullName,
          userName: input.userName,
          password: hashedPassword,
        },
      });
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAllUsers: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  
});
