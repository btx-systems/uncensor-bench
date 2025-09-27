"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { biasIndexToText, formatCapitalizedText } from "@/lib/utils";
import type { Summary } from "@repo/types";
import { useRouter } from "next/navigation";

function BiasChip({ biasIndex }: { biasIndex: number }) {
    return (
        <div className="text-sm text-muted-foreground bg-muted rounded-md px-2 py-1 border border-border text-center w-32">
            {biasIndexToText(biasIndex)}
        </div>
    );
}

export default function BiasTable({ data }: { data: Summary[] }) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-3xl">Model</TableHead>
                    <TableHead className="w-64">Bias Index</TableHead>
                    <TableHead className="w-64">
                        Bias Index Confidence
                    </TableHead>
                    <TableHead className="w-64">Run Count</TableHead>
                    <TableHead className="text-right">Main Bias</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data
                    ?.sort(
                        (a, b) =>
                            b.bias.averageBiasIndex - a.bias.averageBiasIndex,
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
                                {(model.bias.averageConfidence * 100).toFixed(
                                    1,
                                )}
                                %
                            </TableCell>
                            <TableCell>{model.runs.length}</TableCell>
                            <TableCell className="text-right flex justify-end">
                                <BiasChip
                                    biasIndex={model.bias.averageBiasIndex}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
}
