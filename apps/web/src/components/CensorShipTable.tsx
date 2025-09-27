"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { formatCapitalizedText } from "@/lib/utils";
import type { Summary } from "@repo/types";
import { useRouter } from "next/navigation";

function CensorshipChip({ type }: { type: string }) {
    return (
        <div className="text-sm text-muted-foreground bg-muted rounded-md px-2 py-1 border border-border text-center w-16">
            {formatCapitalizedText(type)}
        </div>
    );
}

export default function CensorShipTable({ data }: { data: Summary[] }) {
    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-3xl">Model</TableHead>
                    <TableHead className="w-64">Censorship Index</TableHead>
                    <TableHead className="w-64">
                        Censorship Index Confidence
                    </TableHead>
                    <TableHead className="w-64">Run Count</TableHead>
                    <TableHead className="text-right">
                        Main Censorship
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data
                    ?.sort(
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
                            <TableCell>{model.runs.length}</TableCell>
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
    );
}
