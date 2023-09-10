import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { recDataRouter } from "./routers/recFormData";
import {userRouter} from "./routers/user"
import {commentsRouter} from "./routers/comments"
import {recommendationRouter} from "./routers/recommendation"
import {clothingItemRouter} from "./routers/clothingItem"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  post: postRouter,
  user: userRouter,
  comments:commentsRouter,
  recommendation:recommendationRouter,
  clothingItem:clothingItemRouter,
  recdata: recDataRouter
  
});

// export type definition of API
export type AppRouter = typeof appRouter;
 