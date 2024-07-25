import { z } from "zod";

export const GetQuerySchema = z.object({
  queryStringParameters: z.object({
    hero: z.string(),
    villain: z.string(),
  }),
});
