import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { models as modelsTable } from "@/lib/db/schema";
import { summarySchema } from "@repo/types";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const model = await db
        .select()
        .from(modelsTable)
        .where(eq(modelsTable.id, id));

    if (!model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    return NextResponse.json(summarySchema.parse(model[0].content), {
        headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
