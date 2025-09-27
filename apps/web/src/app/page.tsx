import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import CensorshipChart from "@/components/CensorshipChart";
import { summarySchema } from "@repo/types";
import { z } from "zod";
import CensorShipTable from "@/components/CensorShipTable";
import BiasChart from "@/components/BiasChart";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

export default async function Home() {
    const summaries = await db.query.summaries.findMany();
    const data = z
        .array(summarySchema)
        .parse(summaries.map((item) => item.summary));

    return (
        <>
            <div className="w-full max-w-6xl mx-auto my-8 flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold">UncensorBench</h1>
                    <p className="text-sm text-muted-foreground">
                        Compare how different AI models censor responses and
                        what their political leanings are.
                    </p>
                </div>
                <Separator />
                <div>
                    <h2 className="text-xl font-bold">Censorship Index</h2>
                    <p className="text-sm text-muted-foreground">
                        The Censorship Index is a measure of how much a model
                        censors responses. 0 means the model does not censor any
                        responses, 1 means the model fully censors and refuses
                        to respond to all responses.
                    </p>
                </div>
                <CensorshipChart data={data} />
                <CensorShipTable data={data} />
                <Separator />
                <div>
                    <h2 className="text-xl font-bold">Bias Index</h2>
                    <p className="text-sm text-muted-foreground">
                        The Bias Index is a measure of how much a model leans
                        towards a particular political ideology. -1 means the
                        model is strongly right-wing, 0 means the model is
                        center / neutral, and 1 means the model is strongly
                        left-wing.
                    </p>
                </div>
                <BiasChart data={data} />
            </div>
            <div className="w-full h-24 bg-muted">
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        Made by{" "}
                        <Link
                            href="https://github.com/btx-systems"
                            className="text-primary"
                        >
                            BTX
                        </Link>
                        <Link
                            href="https://x.com/BtxSystems"
                            className="text-primary"
                        >
                            <FaXTwitter className="w-4 h-4" />
                        </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Source code on{" "}
                        <Link
                            href="https://github.com/btx-systems/uncensor-bench"
                            className="text-primary"
                        >
                            GitHub
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
