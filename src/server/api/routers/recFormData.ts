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
  // Define your procedure with input validation
  getItemsArray: protectedProcedure
.input(z.object({ userId: z.string() }))
.query(async ({ input, ctx }) => {
  const brandsAndColorsArray = await ctx.prisma.recData.findMany({
    where: {
      userId: input.userId,
    },
    select: {
      favBrand: true,
      favColor: true,
    },
  });
  
  const userBrandsArray = brandsAndColorsArray.map((item) => item.favBrand).flat();
  const userColorsArray = brandsAndColorsArray.map((item) => item.favColor).flat();
  
  const maxItemsPerBrand = Math.floor(22 / userBrandsArray.length);
  const maxItemsPerColor = Math.floor(22 / userColorsArray.length);
  
  let itemsArray = [];

  for (let brand of userBrandsArray) {
    for (let color of userColorsArray) {
      const partialItemsArray = await ctx.prisma.clothingItem.findMany({
        where: {
          brand: brand,
          color: color,
        },
        select: {
          brand: true,
          color: true,
          description: true,
          imageUrl: true,
        },
        take: Math.min(maxItemsPerBrand, maxItemsPerColor),
      });
      itemsArray = [...itemsArray, ...partialItemsArray];
    }
  }

  // If the itemsArray exceeds 66 items, you might want to trim it down here

  return itemsArray;
}),

  // Get 64 items dependent on user's favorite brand and color which will be provided in the input.
  // The input will be an object with the following properties:
  // - brands: array of strings
  // - color: array of strings
  // The function will return an array of 63 items that match the user's preferences.
  // The database schema will have the following properties:
  // - brand: string
  // - color: string
  // - item: string
  // - imageUrl: string
  // The returned array will be sorted by price in ascending order.

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
});
