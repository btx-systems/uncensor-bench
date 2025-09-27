import { summarySchema } from "@repo/types";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { models, summaries } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

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

    await db
        .insert(summaries)
        .values({
            id: data.id,
            summary: data,
        })
        .onConflictDoUpdate({
            target: [summaries.id],
            set: {
                summary: data,
            },
        });

    revalidatePath("/");
    revalidatePath(`/model/${data.id}`);

    return NextResponse.json({ message: "Model added successfully" });
}
