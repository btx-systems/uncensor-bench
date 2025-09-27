"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { GetModelsResponse } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

const chartConfig = {
    censorship: {
        label: "Censorship Index",
        color: "#2563eb",
    },
} satisfies ChartConfig;

const biasChartConfig = {
    bias: {
        label: "Bias Index",
        color: "#2563eb",
    },
} satisfies ChartConfig;

const formatCapitalizedText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const truncateLabel = (label: string, maxLength: number = 15): string => {
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
};

function biasIndexToText(biasIndex: number): string {
    if (biasIndex <= -0.8) return "Strongly Right";
    if (biasIndex <= -0.5) return "Moderately Right";
    if (biasIndex <= -0.3) return "Right";
    if (biasIndex <= -0.1) return "Slightly Right";
    if (biasIndex <= 0.1) return "Center / Neutral";
    if (biasIndex <= 0.3) return "Slightly Left";
    if (biasIndex <= 0.5) return "Left";
    if (biasIndex <= 0.8) return "Moderately Left";

    return "Strongly Left";
}

function CensorshipChip({ type }: { type: string }) {
    return (
        <div className="text-sm text-muted-foreground bg-muted rounded-md px-2 py-1 border border-border text-center w-16">
            {formatCapitalizedText(type)}
        </div>
    );
}

function BiasChip({ biasIndex }: { biasIndex: number }) {
    return (
        <div className="text-sm text-muted-foreground bg-muted rounded-md px-2 py-1 border border-border text-center w-32">
            {biasIndexToText(biasIndex)}
        </div>
    );
}

export default function Home() {
    const { data } = useSWR<GetModelsResponse>(`/api/models`, fetcher);
    const router = useRouter();

    return (
        <div className="w-full max-w-6xl mx-auto my-8 flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-bold">UncensorBench</h1>
                <p className="text-sm text-muted-foreground">
                    Compare how different AI models censor responses and what
                    their political leanings are.
                </p>
            </div>
            <Separator />
            <div>
                <h2 className="text-xl font-bold">Censorship Index</h2>
                <p className="text-sm text-muted-foreground">
                    The Censorship Index is a measure of how much a model
                    censors responses. 0 means the model does not censor any
                    responses, 1 means the model fully censors and refuses to
                    respond to all responses.
                </p>
            </div>
            <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full"
            >
                <BarChart
                    accessibilityLayer
                    data={data?.models
                        .map((model) => ({
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-3xl">Model</TableHead>
                        <TableHead className="w-64">Censorship Index</TableHead>
                        <TableHead className="w-64">
                            Censorship Index Confidence
                        </TableHead>
                        <TableHead className="text-right">
                            Main Censorship
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.models
                        .sort(
                            (a, b) =>
                                b.censorship.averageCensorshipIndex -
                                a.censorship.averageCensorshipIndex,
                        )
                        .map((model) => (
                            <TableRow
                                key={model.model}
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push(`/model/${model.id}`);
                                }}
                            >
                                <TableCell>{model.model}</TableCell>
                                <TableCell>
                                    {model.censorship.averageCensorshipIndex.toFixed(
                                        3,
                                    )}
                                </TableCell>
                                <TableCell>
                                    {(
                                        model.censorship.averageConfidence * 100
                                    ).toFixed(1)}
                                    %
                                </TableCell>
                                <TableCell className="text-right flex justify-end">
                                    {model.censorship.averageCensorshipIndex >=
                                    0.05 ? (
                                        <CensorshipChip
                                            type={model.censorship.types[0]}
                                        />
                                    ) : (
                                        <CensorshipChip type="None" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <Separator />
            <div>
                <h2 className="text-xl font-bold">Bias Index</h2>
                <p className="text-sm text-muted-foreground">
                    The Bias Index is a measure of how much a model leans
                    towards a particular political ideology. -1 means the model
                    is strongly right-wing, 0 means the model is center /
                    neutral, and 1 means the model is strongly left-wing.
                </p>
            </div>
            <ChartContainer
                config={biasChartConfig}
                className="min-h-[200px] w-full"
            >
                <BarChart
                    data={data?.models
                        .map((model) => ({
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-3xl">Model</TableHead>
                        <TableHead className="w-64">Bias Index</TableHead>
                        <TableHead className="w-64">
                            Bias Index Confidence
                        </TableHead>
                        <TableHead className="text-right">Main Bias</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.models
                        .sort(
                            (a, b) =>
                                b.bias.averageBiasIndex -
                                a.bias.averageBiasIndex,
                        )
                        .map((model) => (
                            <TableRow
                                key={model.model}
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push(`/model/${model.id}`);
                                }}
                            >
                                <TableCell>{model.model}</TableCell>
                                <TableCell>
                                    {model.bias.averageBiasIndex.toFixed(3)}
                                </TableCell>
                                <TableCell>
                                    {(
                                        model.bias.averageConfidence * 100
                                    ).toFixed(1)}
                                    %
                                </TableCell>
                                <TableCell className="text-right flex justify-end">
                                    <BiasChip
                                        biasIndex={model.bias.averageBiasIndex}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
