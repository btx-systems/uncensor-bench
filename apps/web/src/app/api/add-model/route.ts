import { summarySchema } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { models } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { success, data } = summarySchema.safeParse(body);

    if (!success) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 },
        );
    }

    // check for auth header
    const auth = request.headers.get("Authorization");

    if (auth !== process.env.AUTH_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.insert(models).values({
        id: data.id,
        name: data.model,
        content: data,
    });

    return NextResponse.json({ message: "Model added successfully" });
}
