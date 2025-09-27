# UncensorBench

UncensorBench is a benchmark to compare how different AI models censor responses and what their political leanings are.
Currently it has 20 prompts to test the models bias and 49 to test the models censorship.

Pull requests and issues are welcome if you want to add more prompts or improve the benchmark.

Link to the benchmark: [https://uncensor.btx.sh](https://uncensor.btx.sh)

## Setup (Benchmark)

```bash
bun install
cd /apps/bench
```

Edit `.env` to set your OpenAI API key and OpenRouter API key.
Edit `src/models.ts` to set the models you want to benchmark.
Edit `src/index.ts` to set the concurrency for the benchmark (Default is 10 prompts and 2 models).

### Run Benchmark

Note: this will by default run the benchmark on all models currently in the `src/models.ts` file which can be expensive and take a while to complete. It is recommended to run the benchmark on a subset of models at a time by commenting out the models you don't want to benchmark in `src/models.ts`.
```bash
bun run bench
```

## Setup (Web)

```bash
bun install
cd /apps/web
```

Edit `.env` to set your Database URL and Auth Token for the add model endpoint.

```bash
bun run dev
```

## Setup (Cloudflare)

### Run Preview

```bash
bun run cf:preview
```

### Run Deploy

```bash
bun run cf:deploy
```