import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Prisma } from '@prisma/client';
const bcrypt = require('bcryptjs');

export type UserCreateInput = Prisma.UserCreateInput & {
  userName: string;
};

export const userRouter = createTRPCRouter({
  addUser: publicProcedure.input(
    z.object({
      email: z.string(),
      fullName: z.string(),
      userName: z.string(),
      password: z.string(),
    })
  ).mutation(async ({ input, ctx }) => {
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
});