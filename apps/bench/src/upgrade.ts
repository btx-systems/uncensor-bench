import path from "node:path";
import fs from "node:fs/promises";
import Logger from "./logger";
import { runSchema, summarySchema, type Run, type Summary } from "@repo/types";

const RESULTS_DIR = path.join(process.cwd(), "results");
const LEGACY_RESULTS_DIR = path.join(process.cwd(), "results_old");

async function pathExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function extractTimestampFromFilename(filename: string): string {
    const basename = path.basename(filename, path.extname(filename));
    const match = basename.match(/(\d{4}-\d{2}-\d{2}T.+)$/);

    if (match && match[1]) {
        return match[1];
    }

    Logger.warn(
        `Could not extract timestamp from ${filename}. Using current time instead.`,
    );
    return new Date().toISOString();
}

function createEmptySummaryFromRun(run: Run): Summary {
    return {
        model: run.model,
        provider: run.provider,
        id: run.id,
        bias: {
            averageBiasIndex: 0,
            averageConfidence: 0,
            percentageLeft: 0,
            percentageRight: 0,
            percentageCenter: 0,
        },
        censorship: {
            averageCensorshipIndex: 0,
            averageConfidence: 0,
            percentageCensored: 0,
            types: [],
            topics: [],
        },
        runs: [],
    } satisfies Summary;
}

function recomputeSummaryMetrics(summary: Summary) {
    if (summary.runs.length === 0) {
        summary.bias.averageBiasIndex = 0;
        summary.bias.averageConfidence = 0;
        summary.bias.percentageLeft = 0;
        summary.bias.percentageRight = 0;
        summary.bias.percentageCenter = 0;
        summary.censorship.averageCensorshipIndex = 0;
        summary.censorship.averageConfidence = 0;
        summary.censorship.percentageCensored = 0;
        summary.censorship.types = [];
        summary.censorship.topics = [];
        return;
    }

    const runCount = summary.runs.length;

    summary.bias.averageBiasIndex =
        summary.runs.reduce(
            (acc, item) => acc + item.bias.averageBiasIndex,
            0,
        ) / runCount;
    summary.bias.averageConfidence =
        summary.runs.reduce(
            (acc, item) => acc + item.bias.averageConfidence,
            0,
        ) / runCount;
    summary.bias.percentageLeft =
        summary.runs.reduce((acc, item) => acc + item.bias.percentageLeft, 0) /
        runCount;
    summary.bias.percentageRight =
        summary.runs.reduce((acc, item) => acc + item.bias.percentageRight, 0) /
        runCount;
    summary.bias.percentageCenter =
        summary.runs.reduce(
            (acc, item) => acc + item.bias.percentageCenter,
            0,
        ) / runCount;

    summary.censorship.averageCensorshipIndex =
        summary.runs.reduce(
            (acc, item) => acc + item.censorship.averageCensorshipIndex,
            0,
        ) / runCount;
    summary.censorship.averageConfidence =
        summary.runs.reduce(
            (acc, item) => acc + item.censorship.averageConfidence,
            0,
        ) / runCount;
    summary.censorship.percentageCensored =
        summary.runs.reduce(
            (acc, item) => acc + item.censorship.percentageCensored,
            0,
        ) / runCount;
    summary.censorship.types = summary.runs.flatMap(
        (item) => item.censorship.types,
    );
    summary.censorship.topics = summary.runs.flatMap(
        (item) => item.censorship.topics,
    );

    summary.censorship.types = summary.censorship.types.filter(
        (type, index, self) => self.indexOf(type) === index,
    );
    summary.censorship.topics = summary.censorship.topics.filter(
        (topic, index, self) => self.indexOf(topic) === index,
    );
}

async function migrateLegacyRuns() {
    if (!(await pathExists(LEGACY_RESULTS_DIR))) {
        Logger.warn(
            `Legacy results directory not found at ${LEGACY_RESULTS_DIR}. Nothing to migrate.`,
        );
        return;
    }

    if (!(await pathExists(RESULTS_DIR))) {
        await fs.mkdir(RESULTS_DIR, { recursive: true });
    }

    const entries = await fs.readdir(LEGACY_RESULTS_DIR);
    const legacyJsonFiles = entries.filter((entry) => entry.endsWith(".json"));

    if (legacyJsonFiles.length === 0) {
        Logger.info("No legacy JSON result files found to migrate.");
        return;
    }

    let migratedCount = 0;

    for (const file of legacyJsonFiles) {
        const legacyPath = path.join(LEGACY_RESULTS_DIR, file);
        Logger.info(`Processing legacy run ${legacyPath}`);

        let rawContent: string;
        try {
            rawContent = await fs.readFile(legacyPath, "utf-8");
        } catch (error) {
            Logger.error(`Failed to read ${legacyPath}:`, error);
            continue;
        }

        let parsedRun: unknown;
        try {
            parsedRun = JSON.parse(rawContent);
        } catch (error) {
            Logger.error(`Failed to parse JSON in ${legacyPath}:`, error);
            continue;
        }

        const timestamp =
            typeof parsedRun === "object" &&
            parsedRun &&
            "timestamp" in parsedRun
                ? (parsedRun as { timestamp?: string }).timestamp
                : undefined;

        const runInput = {
            ...(parsedRun as Record<string, unknown>),
            timestamp: timestamp ?? extractTimestampFromFilename(file),
        } satisfies Record<string, unknown>;

        let run: Run;
        try {
            run = runSchema.parse(runInput);
        } catch (error) {
            Logger.error(`Legacy run ${legacyPath} failed validation:`, error);
            continue;
        }

        const summaryPath = path.join(RESULTS_DIR, `${run.id}.json`);

        let summary: Summary;
        if (await pathExists(summaryPath)) {
            try {
                const summaryRaw = await fs.readFile(summaryPath, "utf-8");
                summary = summarySchema.parse(JSON.parse(summaryRaw));
            } catch (error) {
                Logger.warn(
                    `Failed to read existing summary at ${summaryPath}. Creating a new summary file. Error:`,
                    error,
                );
                summary = createEmptySummaryFromRun(run);
            }
        } else {
            summary = createEmptySummaryFromRun(run);
        }

        const duplicateRun = summary.runs.some(
            (existing) => existing.timestamp === run.timestamp,
        );

        if (duplicateRun) {
            Logger.info(
                `Run with timestamp ${run.timestamp} already exists in ${summaryPath}. Skipping.`,
            );
            continue;
        }

        summary.runs.push(run);
        summary.runs.sort(
            (a, b) =>
                new Date(a.timestamp ?? 0).getTime() -
                new Date(b.timestamp ?? 0).getTime(),
        );

        recomputeSummaryMetrics(summary);

        const validatedSummary = summarySchema.parse(summary);

        await fs.writeFile(
            summaryPath,
            `${JSON.stringify(validatedSummary, null, 2)}\n`,
            "utf-8",
        );

        Logger.info(`Migrated run for model ${run.model} -> ${summaryPath}`);
        migratedCount += 1;
    }

    Logger.info(`Migration completed. Migrated ${migratedCount} legacy runs.`);
}

await migrateLegacyRuns();
