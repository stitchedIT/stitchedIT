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
        favColor: z.array(z.string()),
        favBrand: z.array(z.string()),
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

    // Define your procedure with input validation
    getBrandsArray: protectedProcedure
      // Your input validation schema
      .input(z.object({ userId: z.string() }))
      .query(({ input, ctx }) => {
        return ctx.prisma.recData.findMany({
          where: {
            userId: input.userId,
          },
          select: {
            favBrand: true,
            favColor: true,
          },
        });
      }),
      // getColorArray: protectedProcedure
      // // Your input validation schema
      // .input(z.object({ userId: z.string() }))
      // .query(({ input, ctx }) => {
      //   return ctx.prisma.recData.findMany({
      //     where: {
      //       userId: input.userId,
      //     },
      //     select: {
      //       favBrand: true,
      //     },
      //   });
      // }),
})