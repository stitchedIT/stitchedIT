import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

 export const recDataRouter = createTRPCRouter({
  addRecData: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        favColor: z.string(),
        favBrand: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const recDatas = await ctx.prisma.recData.create({
        data: {
          userId: input.userId,
          favColor: input.favColor,
          favBrand: input.favBrand,
        },
      });
      return recDatas;
    }),
 })