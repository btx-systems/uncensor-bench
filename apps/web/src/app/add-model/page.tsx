"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { summarySchema } from "@repo/types";

export default function AddModelPage() {
    const [runSummary, setRunSummary] = useState<File | null>(null);
    const [authToken, setAuthToken] = useState<string>("");

    async function handleSubmit() {
        // parse run summary as json
        const text = await runSummary?.text();

        if (!text) {
            toast.error("No run summary provided");
            return;
        }

        const json = summarySchema.safeParse(JSON.parse(text));

        if (!json.success) {
            toast.error("Invalid run summary");
            return;
        }

        const data = json.data;

        // add model to database
        const response = await fetch("/api/add-model", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                Authorization: authToken,
            },
        });

        if (!response.ok) {
            toast.error("Failed to add model", {
                description: response.statusText,
            });

            return;
        }

        toast.success("Model added successfully");
        setRunSummary(null);
    }

    return (
        <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <CardHeader>
                <CardTitle>Add Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Run Summary</Label>
                    <Input
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) =>
                            setRunSummary(e.target.files?.[0] ?? null)
                        }
                        accept=".json"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Auth Token</Label>
                    <Input
                        type="text"
                        className=""
                        onChange={(e) => setAuthToken(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                    Add Model
                </Button>
            </CardContent>
        </Card>
    );
}
