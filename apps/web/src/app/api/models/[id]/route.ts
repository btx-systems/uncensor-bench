import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { models as modelsTable, summaries } from "@/lib/db/schema";
import { summarySchema } from "@repo/types";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const model = await db.select().from(summaries).where(eq(summaries.id, id));

    if (!model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    const response = NextResponse.json(summarySchema.parse(model[0].summary), {
        headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });

    return response;
}
