import type { Summary } from "./types";

function formatScore(value: number): string {
	return Number.isFinite(value) ? value.toFixed(2) : "N/A";
}

function formatPercentage(value: number): string {
	return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "N/A";
}

function blockquote(text: string): string {
	const trimmed = text.trim();
	if (!trimmed) {
		return "> (no content)";
	}
	return trimmed
		.split(/\r?\n/)
		.map((line) => `> ${line}`)
		.join("\n");
}

export function generateSummary(summary: Summary): string {
	const lines: string[] = [];

	lines.push(`# Benchmark Report: ${summary.model}`);
	lines.push("");
	lines.push(`**Provider:** ${summary.provider}`);
	lines.push("");
	lines.push("## Highlights");
	lines.push(`- Total bias prompts: ${summary.totalBiasPrompts}`);
	lines.push(`- Total censorship prompts: ${summary.totalCensorshipPrompts}`);
	lines.push(`- Aggregate bias score: ${formatScore(summary.bias.score)}`);
	lines.push(`- Bias summary score: ${formatScore(summary.bias.summaryScore)}`);
	lines.push(
		`- Average bias index [-1..1]: ${formatScore(summary.bias.averageBiasIndex)}`,
	);
	lines.push(
		`- Average bias confidence [0..1]: ${formatScore(summary.bias.averageConfidence)}`,
	);
	lines.push(
		`- Aggregate censorship score: ${formatScore(summary.censorship.score)}`,
	);
	lines.push(
		`- Censorship summary score: ${formatScore(summary.censorship.summaryScore)}`,
	);
	lines.push(
		`- Average censorship index [0..1]: ${formatScore(summary.censorship.averageCensorshipIndex)}`,
	);
	lines.push(
		`- Average censorship confidence [0..1]: ${formatScore(summary.censorship.averageConfidence)}`,
	);
	lines.push("");

	lines.push("## Bias Assessment");
	lines.push(summary.bias.summary.trim());
	lines.push("");
	lines.push("**Metrics**");
	lines.push(`- Average score: ${formatScore(summary.bias.averageScore)}`);
	lines.push(
		`- Average index [-1..1]: ${formatScore(summary.bias.averageBiasIndex)}`,
	);
	lines.push(
		`- Average confidence [0..1]: ${formatScore(summary.bias.averageConfidence)}`,
	);
	lines.push(`- Left: ${formatPercentage(summary.bias.percentageLeft)}`);
	lines.push(`- Center: ${formatPercentage(summary.bias.percentageCenter)}`);
	lines.push(`- Right: ${formatPercentage(summary.bias.percentageRight)}`);
	lines.push("");

	lines.push("## Censorship Assessment");
	lines.push(summary.censorship.summary.trim());
	lines.push("");
	lines.push("**Metrics**");
	lines.push(
		`- Average score: ${formatScore(summary.censorship.averageScore)}`,
	);
	lines.push(
		`- Average index [0..1]: ${formatScore(summary.censorship.averageCensorshipIndex)}`,
	);
	lines.push(
		`- Average confidence [0..1]: ${formatScore(summary.censorship.averageConfidence)}`,
	);
	lines.push(
		`- Percentage censored: ${formatPercentage(summary.censorship.percentageCensored)}`,
	);
	lines.push(
		`- Types observed: ${summary.censorship.types.length > 0 ? summary.censorship.types.join(", ") : "None"}`,
	);
	lines.push(
		`- Topics censored: ${summary.censorship.topics.length > 0 ? summary.censorship.topics.join(", ") : "None"}`,
	);
	lines.push("");

	lines.push("## Bias Prompt Details");
	if (summary.biases.length === 0) {
		lines.push("No bias prompts were recorded.");
	} else {
		summary.biases.forEach((entry, index) => {
			lines.push(
				`### Bias Prompt ${index + 1}: ${entry.bias} (index: ${formatScore(entry.biasIndex)}, conf: ${formatScore(entry.confidence)})`,
			);
			lines.push("");
			lines.push("**Prompt**");
			lines.push(blockquote(entry.prompt));
			lines.push("");
			lines.push("**Response**");
			lines.push(blockquote(entry.response));
			if (entry.rationale) {
				lines.push("");
				lines.push("**Rationale**");
				lines.push(blockquote(entry.rationale));
			}
			lines.push("");
		});
	}

	lines.push("## Censorship Prompt Details");
	if (summary.censorships.length === 0) {
		lines.push("No censorship prompts were recorded.");
	} else {
		summary.censorships.forEach((entry, index) => {
			lines.push(
				`### Censorship Prompt ${index + 1}: ${entry.censorship} (index: ${formatScore(entry.censorshipIndex)}, conf: ${formatScore(entry.confidence)})`,
			);
			lines.push("");
			lines.push("**Prompt**");
			lines.push(blockquote(entry.prompt));
			lines.push("");
			lines.push("**Response**");
			lines.push(blockquote(entry.response));
			if (entry.rationale) {
				lines.push("");
				lines.push("**Rationale**");
				lines.push(blockquote(entry.rationale));
			}
			lines.push("");
		});
	}

	return `${lines.join("\n")}\n`;
}
