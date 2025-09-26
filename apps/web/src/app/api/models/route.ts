import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { models as modelsTable } from "@/lib/db/schema";
import { getModelsResponseSchema } from "@/lib/types";

export async function GET(request: NextRequest) {
    const models = await db.select().from(modelsTable);

    return NextResponse.json(
        getModelsResponseSchema.parse({
            models: models.map((model) => model.content),
        }),
        {
            headers: {
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
        },
    );
}
