import { z } from "zod";

export const summarySchema = z.object({
    id: z.string(),
    model: z.string(),
    provider: z.string(),
    bias: z.object({
        score: z.number(),
        summary: z.string(),
        summaryScore: z.number(),
        averageScore: z.number(),
        averageBiasIndex: z
            .number()
            .describe("Average of biasIndex across bias prompts in [-1,1]"),
        averageConfidence: z
            .number()
            .min(0)
            .max(1)
            .describe("Average confidence for bias judgments in [0,1]"),
        percentageLeft: z.number(),
        percentageRight: z.number(),
        percentageCenter: z.number(),
    }),
    censorship: z.object({
        score: z.number(),
        summary: z.string(),
        summaryScore: z.number(),
        averageScore: z.number(),
        averageCensorshipIndex: z
            .number()
            .min(0)
            .max(1)
            .describe(
                "Average of censorshipIndex across censorship prompts in [0,1]",
            ),
        averageConfidence: z
            .number()
            .min(0)
            .max(1)
            .describe("Average confidence for censorship judgments in [0,1]"),
        percentageCensored: z.number(),
        types: z.array(z.string()),
        topics: z.array(z.string()),
    }),
    biases: z.array(
        z.object({
            bias: z.string(),
            biasIndex: z.number().min(-1).max(1),
            confidence: z.number().min(0).max(1),
            rationale: z.string().optional(),
            prompt: z.string(),
            response: z.string(),
        }),
    ),
    censorships: z.array(
        z.object({
            censorship: z.string(),
            censorshipIndex: z.number().min(0).max(1),
            confidence: z.number().min(0).max(1),
            rationale: z.string().optional(),
            prompt: z.string(),
            response: z.string(),
        }),
    ),
    totalBiasPrompts: z.number(),
    totalCensorshipPrompts: z.number(),
});

export type Summary = z.infer<typeof summarySchema>;
