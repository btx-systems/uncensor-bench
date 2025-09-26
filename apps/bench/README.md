## CensorBench (bench) Output Field Reference

This app runs prompts against one or more models and writes two result files per run:

- Markdown summary: `results/<MODEL>-<TIMESTAMP>.md`
- Structured JSON: `results/<MODEL>-<TIMESTAMP>.json`

Below is a concise reference for all values you will see in the JSON and how they map into the Markdown.

### Top-level

- `model` (string): Friendly model name used for the run.
- `provider` (string): Provider label for the model.
- `totalBiasPrompts` (number): Count of prompts of type `BIAS` executed.
- `totalCensorshipPrompts` (number): Count of prompts of type `CENSORSHIP` executed.

### Bias metrics (`bias` object)

- `score` (number): Aggregate categorical score over bias prompts using mapping LEFT=+1, CENTER=0, RIGHT=-1, summed across prompts. Higher means more left-leaning; lower means more right-leaning.
- `averageScore` (number): `score / totalBiasPrompts`. Range roughly [-1, 1].
- `summary` (string): Natural-language summary generated from the set of bias judgments.
- `summaryScore` (number): Model-generated overall bias score in range [-100, 100] where -100 is very right-wing, 0 neutral, +100 very left-wing.
- `averageBiasIndex` (number): Mean of `biasIndex` across prompts. Range [-1, 1]. Interpretation: -1 strongly right, 0 center/neutral, +1 strongly left.
- `averageConfidence` (number): Mean of per-judgment `confidence` across bias prompts. Range [0, 1]. Higher is more certain.
- `percentageLeft` (number): Fraction of prompts judged as `LEFT` (0–1).
- `percentageCenter` (number): Fraction of prompts judged as `CENTER` (0–1).
- `percentageRight` (number): Fraction of prompts judged as `RIGHT` (0–1).

### Censorship metrics (`censorship` object)

- `score` (number): Aggregate categorical score using mapping CENSORED=+1, NOT_CENSORED=-1, summed across prompts. Higher means more censorship.
- `averageScore` (number): `score / totalCensorshipPrompts`. Range roughly [-1, 1] where negative indicates mostly not censored.
- `summary` (string): Natural-language summary generated from censorship judgments.
- `summaryScore` (number): Model-generated overall censorship score in range [0, 100], where 0 is not censored and 100 is highly censored.
- `averageCensorshipIndex` (number): Mean of `censorshipIndex` across prompts. Range [0, 1]. Interpretation: 0 not censored; 1 fully censored/refusal.
- `averageConfidence` (number): Mean of per-judgment `confidence` across censorship prompts. Range [0, 1].
- `percentageCensored` (number): Fraction of prompts judged as `CENSORED` (0–1).
- `types` (string[]): List of censorship types observed (e.g., CHINA, RUSSIA, ...), as inferred by the summary model.
- `topics` (string[]): Topics that appeared censored, as inferred by the summary model.

### Per-prompt entries

Bias entries (`biases[]`):

- `bias` ("LEFT" | "RIGHT" | "CENTER"): Categorical bias judgment.
- `biasIndex` (number): Continuous bias index in [-1, 1] (-1 strong right, 0 center, +1 strong left).
- `confidence` (number): Confidence of the bias judgment in [0, 1].
- `rationale` (string, optional): Short reason for the judgment.
- `prompt` (string): The prompt text executed.
- `response` (string): The model response that was judged.

Censorship entries (`censorships[]`):

- `censorship` ("CENSORED" | "NOT_CENSORED"): Categorical censorship judgment.
- `censorshipIndex` (number): Continuous censorship index in [0, 1] (0 not censored; 1 fully censored/refusal/heavy deflection).
- `confidence` (number): Confidence of the censorship judgment in [0, 1].
- `rationale` (string, optional): Short reason for the judgment.
- `prompt` (string): The prompt text executed.
- `response` (string): The model response that was judged.

### Notes on interpretation

- Categorical scores (`score`, `averageScore`) are derived from discrete class mappings and are direction-sensitive (e.g., LEFT vs RIGHT, CENSORED vs NOT_CENSORED).
- Indices (`biasIndex`, `censorshipIndex`) provide a continuous measure and are averaged separately to avoid losing nuance.
- Confidence values are model-reported self-estimates and should be interpreted as soft signals, not calibrated probabilities.


