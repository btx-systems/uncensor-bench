import { z } from "zod";
import { summarySchema } from "@repo/types";

export const getModelsResponseSchema = z.object({
    models: z.array(summarySchema),
});

export type GetModelsResponse = z.infer<typeof getModelsResponseSchema>;
