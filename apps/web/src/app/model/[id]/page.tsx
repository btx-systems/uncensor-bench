// "use client";

// import { use, useMemo, useRef } from "react";
// import useSWR from "swr";
// import { fetcher } from "@/lib/utils";
// import type { Run, Summary } from "@repo/types";
// import { Separator } from "@/components/ui/separator";
// import { MarkdownComponent } from "@/components/markdown";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useEffect, useState } from "react";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { useVirtualizer } from "@tanstack/react-virtual";

// export default function ModelPage({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const { id } = use(params);
//     const { data, isLoading } = useSWR<Summary>(`/api/models/${id}`, fetcher, {
//         revalidateOnFocus: false,
//         revalidateIfStale: false,
//     });
//     const [selectedRun, setSelectedRun] = useState<Run | null>(null);

//     useEffect(() => {
//         console.log(data?.runs);
//         setSelectedRun(data?.runs[0] ?? null);
//     }, [data]);

//     if (isLoading) {
//         return (
//             <p className="text-lg text-muted-foreground w-full h-screen flex justify-center items-center">
//                 Loading...
//             </p>
//         );
//     }

//     return (
//         <div className="w-full max-w-6xl mx-auto my-8 flex flex-col gap-4">
//             <Select
//                 value={selectedRun?.timestamp}
//                 onValueChange={(value) => {
//                     setSelectedRun(
//                         data?.runs.find((run) => run.timestamp === value) ??
//                             null,
//                     );
//                 }}
//             >
//                 <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select a run" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {data?.runs.map((run, index) => (
//                         <SelectItem key={run.timestamp} value={run.timestamp}>
//                             Run {index + 1} ({run.timestamp})
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//             <Separator />
//             <div>
//                 <h1 className="text-3xl font-bold">{data?.model}</h1>
//                 <p className="text-sm text-muted-foreground">
//                     Provider: {data?.provider}
//                 </p>
//             </div>
//             <Separator />
//             <div>
//                 <h2 className="text-2xl font-bold">Highlights</h2>
//                 <ul className="list-disc list-inside px-4 mt-1">
//                     <li>Total bias prompts: {selectedRun?.totalBiasPrompts}</li>
//                     <li>
//                         Total censorship prompts:{" "}
//                         {selectedRun?.totalCensorshipPrompts}
//                     </li>
//                     <li>
//                         Average bias index:{" "}
//                         {(selectedRun?.bias.averageBiasIndex ?? 0).toFixed(3)}
//                     </li>
//                     <li>
//                         Average bias confidence:{" "}
//                         {((data?.bias.averageConfidence ?? 0) * 100).toFixed(2)}
//                         %
//                     </li>
//                     <li>
//                         Average censorship index:{" "}
//                         {(
//                             selectedRun?.censorship.averageCensorshipIndex ?? 0
//                         ).toFixed(3)}
//                     </li>
//                     <li>
//                         Average censorship confidence:{" "}
//                         {(
//                             (selectedRun?.censorship.averageConfidence ?? 0) *
//                             100
//                         ).toFixed(2)}
//                         %
//                     </li>
//                 </ul>
//             </div>
//             <Separator />
//             <div>
//                 <h2 className="text-2xl font-bold">Bias Assessment</h2>
//                 <p className="text-sm mt-1">{selectedRun?.bias.summary}</p>
//             </div>
//             <Separator />
//             <div>
//                 <h2 className="text-2xl font-bold">Censorship Assessment</h2>
//                 <p className="text-sm mt-1">
//                     {selectedRun?.censorship.summary}
//                 </p>
//             </div>
//             <Separator />
//             <div>
//                 <h2 className="text-2xl font-bold">Bias Prompts</h2>
//                 <div className="space-y-2 mt-2">
//                     {selectedRun?.biases.map((bias, index) => (
//                         // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//                         <div className="space-y-2" key={index}>
//                             <h3 className="text-lg font-bold">
//                                 Bias Prompt {index + 1}:{" "}
//                                 {bias.bias === "LEFT"
//                                     ? "Left"
//                                     : bias.bias === "RIGHT"
//                                       ? "Right"
//                                       : "Neutral"}{" "}
//                                 (index: {bias.biasIndex.toFixed(3)}, confidence:{" "}
//                                 {(bias.confidence * 100).toFixed(2)}
//                                 %)
//                             </h3>
//                             <h4 className="text-md font-medium">Prompt</h4>
//                             <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                 {bias.prompt}
//                             </p>
//                             <h4 className="text-md font-medium">Response</h4>
//                             <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//                                 <MarkdownComponent>
//                                     {bias.response}
//                                 </MarkdownComponent>
//                             </div>
//                             <h4 className="text-md font-medium">Rationale</h4>
//                             <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                 {bias.rationale}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//                 <Separator className="my-4 mt-6" />
//                 <div>
//                     <h2 className="text-2xl font-bold">Censorship Prompts</h2>
//                     <div className="space-y-2 mt-2">
//                         {selectedRun?.censorships.map((censorship, index) => (
//                             <div
//                                 className="space-y-2"
//                                 // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//                                 key={index}
//                             >
//                                 <h3 className="text-lg font-bold">
//                                     Censorship Prompt {index + 1}:{" "}
//                                     {censorship.censorship === "CENSORED"
//                                         ? "Censored"
//                                         : "Not Censored"}{" "}
//                                     (index:{" "}
//                                     {censorship.censorshipIndex.toFixed(3)},
//                                     confidence:{" "}
//                                     {(censorship.confidence * 100).toFixed(2)}
//                                     %)
//                                 </h3>
//                                 <h4 className="text-md font-medium">Prompt</h4>
//                                 <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                     {censorship.prompt}
//                                 </p>
//                                 <h4 className="text-md font-medium">
//                                     Response
//                                 </h4>
//                                 <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//                                     <MarkdownComponent>
//                                         {censorship.response}
//                                     </MarkdownComponent>
//                                 </div>
//                                 <h4 className="text-md font-medium">
//                                     Rationale
//                                 </h4>
//                                 <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                     {censorship.rationale}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             {/* <Tabs defaultValue="0" className="w-full">
//                 <TabsList className="w-full">
//                     {data?.runs.map((run, index) => (
//                         <TabsTrigger
//                             value={index.toString()}
//                             key={run.timestamp}
//                         >
//                             {index + 1} ({run.timestamp})
//                         </TabsTrigger>
//                     ))}
//                 </TabsList>
//                 {data?.runs.map((run, index) => (
//                     <TabsContent
//                         value={index.toString()}
//                         key={run.timestamp}
//                         className="flex flex-col gap-4"
//                     >
//                         <div>
//                             <h1 className="text-3xl font-bold">
//                                 {data?.model}
//                             </h1>
//                             <p className="text-sm text-muted-foreground">
//                                 Provider: {data?.provider}
//                             </p>
//                         </div>
//                         <Separator />
//                         <div>
//                             <h2 className="text-2xl font-bold">Highlights</h2>
//                             <ul className="list-disc list-inside px-4 mt-1">
//                                 <li>
//                                     Total bias prompts: {run?.totalBiasPrompts}
//                                 </li>
//                                 <li>
//                                     Total censorship prompts:{" "}
//                                     {run?.totalCensorshipPrompts}
//                                 </li>
//                                 <li>
//                                     Average bias index:{" "}
//                                     {(run?.bias.averageBiasIndex ?? 0).toFixed(
//                                         3,
//                                     )}
//                                 </li>
//                                 <li>
//                                     Average bias confidence:{" "}
//                                     {(
//                                         (data?.bias.averageConfidence ?? 0) *
//                                         100
//                                     ).toFixed(2)}
//                                     %
//                                 </li>
//                                 <li>
//                                     Average censorship index:{" "}
//                                     {(
//                                         run?.censorship
//                                             .averageCensorshipIndex ?? 0
//                                     ).toFixed(3)}
//                                 </li>
//                                 <li>
//                                     Average censorship confidence:{" "}
//                                     {(
//                                         (run?.censorship.averageConfidence ??
//                                             0) * 100
//                                     ).toFixed(2)}
//                                     %
//                                 </li>
//                             </ul>
//                         </div>
//                         <Separator />
//                         <div>
//                             <h2 className="text-2xl font-bold">
//                                 Bias Assessment
//                             </h2>
//                             <p className="text-sm mt-1">{run?.bias.summary}</p>
//                         </div>
//                         <Separator />
//                         <div>
//                             <h2 className="text-2xl font-bold">
//                                 Censorship Assessment
//                             </h2>
//                             <p className="text-sm mt-1">
//                                 {run?.censorship.summary}
//                             </p>
//                         </div>
//                         <Separator />
//                         <div>
//                             <h2 className="text-2xl font-bold">Bias Prompts</h2>
//                             <div className="space-y-2 mt-2">
//                                 {run?.biases.map((bias, index) => (
//                                     // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//                                     <div className="space-y-2" key={index}>
//                                         <h3 className="text-lg font-bold">
//                                             Bias Prompt {index + 1}:{" "}
//                                             {bias.bias === "LEFT"
//                                                 ? "Left"
//                                                 : bias.bias === "RIGHT"
//                                                   ? "Right"
//                                                   : "Neutral"}{" "}
//                                             (index: {bias.biasIndex.toFixed(3)},
//                                             confidence:{" "}
//                                             {(bias.confidence * 100).toFixed(2)}
//                                             %)
//                                         </h3>
//                                         <h4 className="text-md font-medium">
//                                             Prompt
//                                         </h4>
//                                         <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                             {bias.prompt}
//                                         </p>
//                                         <h4 className="text-md font-medium">
//                                             Response
//                                         </h4>
//                                         <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//                                             <MarkdownComponent>
//                                                 {bias.response}
//                                             </MarkdownComponent>
//                                         </div>
//                                         <h4 className="text-md font-medium">
//                                             Rationale
//                                         </h4>
//                                         <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                             {bias.rationale}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>
//                             <Separator className="my-4 mt-6" />
//                             <div>
//                                 <h2 className="text-2xl font-bold">
//                                     Censorship Prompts
//                                 </h2>
//                                 <div className="space-y-2 mt-2">
//                                     {run?.censorships.map(
//                                         (censorship, index) => (
//                                             <div
//                                                 className="space-y-2"
//                                                 // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//                                                 key={index}
//                                             >
//                                                 <h3 className="text-lg font-bold">
//                                                     Censorship Prompt{" "}
//                                                     {index + 1}:{" "}
//                                                     {censorship.censorship ===
//                                                     "CENSORED"
//                                                         ? "Censored"
//                                                         : "Not Censored"}{" "}
//                                                     (index:{" "}
//                                                     {censorship.censorshipIndex.toFixed(
//                                                         3,
//                                                     )}
//                                                     , confidence:{" "}
//                                                     {(
//                                                         censorship.confidence *
//                                                         100
//                                                     ).toFixed(2)}
//                                                     %)
//                                                 </h3>
//                                                 <h4 className="text-md font-medium">
//                                                     Prompt
//                                                 </h4>
//                                                 <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                                     {censorship.prompt}
//                                                 </p>
//                                                 <h4 className="text-md font-medium">
//                                                     Response
//                                                 </h4>
//                                                 <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//                                                     <MarkdownComponent>
//                                                         {censorship.response}
//                                                     </MarkdownComponent>
//                                                 </div>
//                                                 <h4 className="text-md font-medium">
//                                                     Rationale
//                                                 </h4>
//                                                 <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//                                                     {censorship.rationale}
//                                                 </p>
//                                             </div>
//                                         ),
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </TabsContent>
//                 ))}
//             </Tabs> */}
//         </div>

//         // <div className="w-full max-w-6xl mx-auto my-8 flex flex-col gap-4">
//         //     <div>
//         //         <h1 className="text-3xl font-bold">{data?.model}</h1>
//         //         <p className="text-sm text-muted-foreground">
//         //             Provider: {data?.provider}
//         //         </p>
//         //     </div>
//         //     <Separator />
//         //     <div>
//         //         <h2 className="text-2xl font-bold">Highlights</h2>
//         //         <ul className="list-disc list-inside px-4 mt-1">
//         //             <li>Total bias prompts: {data?.totalBiasPrompts}</li>
//         //             <li>
//         //                 Total censorship prompts: {data?.totalCensorshipPrompts}
//         //             </li>
//         //             <li>
//         //                 Average bias index:{" "}
//         //                 {(data?.bias.averageBiasIndex ?? 0).toFixed(3)}
//         //             </li>
//         //             <li>
//         //                 Average bias confidence:{" "}
//         //                 {((data?.bias.averageConfidence ?? 0) * 100).toFixed(2)}
//         //                 %
//         //             </li>
//         //             <li>
//         //                 Average censorship index:{" "}
//         //                 {(data?.censorship.averageCensorshipIndex ?? 0).toFixed(
//         //                     3,
//         //                 )}
//         //             </li>
//         //             <li>
//         //                 Average censorship confidence:{" "}
//         //                 {(
//         //                     (data?.censorship.averageConfidence ?? 0) * 100
//         //                 ).toFixed(2)}
//         //                 %
//         //             </li>
//         //         </ul>
//         //     </div>
//         //     <Separator />
//         //     <div>
//         //         <h2 className="text-2xl font-bold">Bias Assessment</h2>
//         //         <p className="text-sm mt-1">{data?.bias.summary}</p>
//         //     </div>
//         //     <Separator />
//         //     <div>
//         //         <h2 className="text-2xl font-bold">Censorship Assessment</h2>
//         //         <p className="text-sm mt-1">{data?.censorship.summary}</p>
//         //     </div>
//         //     <Separator />
//         //     <div>
//         //         <h2 className="text-2xl font-bold">Bias Prompts</h2>
//         //         <div className="space-y-2 mt-2">
//         //             {data?.biases.map((bias, index) => (
//         //                 // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//         //                 <div className="space-y-2" key={index}>
//         //                     <h3 className="text-lg font-bold">
//         //                         Bias Prompt {index + 1}:{" "}
//         //                         {bias.bias === "LEFT"
//         //                             ? "Left"
//         //                             : bias.bias === "RIGHT"
//         //                               ? "Right"
//         //                               : "Neutral"}{" "}
//         //                         (index: {bias.biasIndex.toFixed(3)}, confidence:{" "}
//         //                         {(bias.confidence * 100).toFixed(2)}%)
//         //                     </h3>
//         //                     <h4 className="text-md font-medium">Prompt</h4>
//         //                     <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//         //                         {bias.prompt}
//         //                     </p>
//         //                     <h4 className="text-md font-medium">Response</h4>
//         //                     <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//         //                         <MarkdownComponent>
//         //                             {bias.response}
//         //                         </MarkdownComponent>
//         //                     </div>
//         //                     <h4 className="text-md font-medium">Rationale</h4>
//         //                     <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//         //                         {bias.rationale}
//         //                     </p>
//         //                 </div>
//         //             ))}
//         //         </div>
//         //         <Separator className="my-4 mt-6" />
//         //         <div>
//         //             <h2 className="text-2xl font-bold">Censorship Prompts</h2>
//         //             <div className="space-y-2 mt-2">
//         //                 {data?.censorships.map((censorship, index) => (
//         //                     // biome-ignore lint/suspicious/noArrayIndexKey: No other option
//         //                     <div className="space-y-2" key={index}>
//         //                         <h3 className="text-lg font-bold">
//         //                             Censorship Prompt {index + 1}:{" "}
//         //                             {censorship.censorship === "CENSORED"
//         //                                 ? "Censored"
//         //                                 : "Not Censored"}{" "}
//         //                             (index:{" "}
//         //                             {censorship.censorshipIndex.toFixed(3)},
//         //                             confidence:{" "}
//         //                             {(censorship.confidence * 100).toFixed(2)}%)
//         //                         </h3>
//         //                         <h4 className="text-md font-medium">Prompt</h4>
//         //                         <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//         //                             {censorship.prompt}
//         //                         </p>
//         //                         <h4 className="text-md font-medium">
//         //                             Response
//         //                         </h4>
//         //                         <div className="text-sm bg-muted/50 rounded-md p-2 px-3.5 border border-border mt-1">
//         //                             <MarkdownComponent>
//         //                                 {censorship.response}
//         //                             </MarkdownComponent>
//         //                         </div>
//         //                         <h4 className="text-md font-medium">
//         //                             Rationale
//         //                         </h4>
//         //                         <p className="text-sm p-2 px-3.5 bg-muted/50 rounded-md border border-border mt-1">
//         //                             {censorship.rationale}
//         //                         </p>
//         //                     </div>
//         //                 ))}
//         //             </div>
//         //         </div>
//         //     </div>
//         // </div>
//     );
// }

import { db } from "@/lib/db";
import { summaries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ModelReport from "@/components/ModelReport";
import { notFound } from "next/navigation";
import { summarySchema } from "@repo/types";

export default async function ModelPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const model = await db.query.summaries.findFirst({
        where: eq(summaries.id, id),
    });

    if (!model) {
        notFound();
    }

    return <ModelReport data={summarySchema.parse(model.summary)} />;
}
