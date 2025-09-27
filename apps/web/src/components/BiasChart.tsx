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

const biasChartConfig = {
    bias: {
        label: "Bias Index",
        color: "#2563eb",
    },
} satisfies ChartConfig;

export default function BiasChart({ data }: { data: Summary[] }) {
    return (
        <ChartContainer
            config={biasChartConfig}
            className="min-h-[200px] w-full"
        >
            <BarChart
                data={data
                    ?.map((model) => ({
                        name: model.model,
                        bias: model.bias.averageBiasIndex,
                    }))
                    .sort((a, b) => b.bias - a.bias)}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={20}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tickFormatter={(value) => truncateLabel(value, 15)}
                />
                <YAxis
                    dataKey="bias"
                    domain={[-1, 1]}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    label={{
                        value: "Bias Index",
                        position: "insideLeft",
                        angle: -90,
                        style: {
                            fontSize: 16,
                            fontWeight: 600,
                        },
                    }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bias" fill="#2563eb" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
