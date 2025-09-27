import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { summaries } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
    const models = await db.select().from(summaries);

    const response = NextResponse.json(
        models.map((model) => model.summary),
        {
            headers: {
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
        },
    );

    return response;
}
