"use client";

import type { Summary } from "@repo/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { truncateLabel } from "@/lib/utils";

const chartConfig = {
    censorship: {
        label: "Censorship Index",
        color: "#2563eb",
    },
} satisfies ChartConfig;

export default function CensorshipChart({ data }: { data: Summary[] }) {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
                accessibilityLayer
                data={data
                    ?.map((model) => ({
                        name: model.model,
                        censorship: model.censorship.averageCensorshipIndex,
                    }))
                    .sort((a, b) => b.censorship - a.censorship)}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tickFormatter={(value) => truncateLabel(value, 15)}
                />
                <YAxis
                    dataKey="censorship"
                    domain={[0, 1]}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    label={{
                        value: "Censorship Index",
                        position: "insideLeft",
                        angle: -90,
                        style: {
                            fontSize: 16,
                            fontWeight: 600,
                        },
                    }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="censorship" fill="#2563eb" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
