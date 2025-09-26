import chalk from "chalk";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

const levelPriority: Record<LogLevel, number> = {
	trace: 0,
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	fatal: 5,
};

export default class Logger {
	private static currentLevel: LogLevel = "trace";

	public static setLevel(level: LogLevel): void {
		this.currentLevel = level;
	}

	private static shouldLog(level: LogLevel): boolean {
		return levelPriority[level] >= levelPriority[this.currentLevel];
	}

	private static formatPrefix(level: LogLevel): string {
		const timestamp = new Date().toISOString();
		return `[${timestamp}] [${level.toUpperCase()}]:`;
	}

	public static trace(...data: unknown[]): void {
		if (!this.shouldLog("trace")) return;
		console.debug(chalk.gray(this.formatPrefix("trace")), ...data);
	}

	public static debug(...data: unknown[]): void {
		if (!this.shouldLog("debug")) return;
		console.debug(chalk.blue(this.formatPrefix("debug")), ...data);
	}

	public static info(...data: unknown[]): void {
		if (!this.shouldLog("info")) return;
		console.info(chalk.green(this.formatPrefix("info")), ...data);
	}

	public static warn(...data: unknown[]): void {
		if (!this.shouldLog("warn")) return;
		console.warn(chalk.yellow(this.formatPrefix("warn")), ...data);
	}

	public static error(...data: unknown[]): void {
		if (!this.shouldLog("error")) return;
		console.error(chalk.red(this.formatPrefix("error")), ...data);
	}

	public static fatal(...data: unknown[]): void {
		if (!this.shouldLog("fatal")) return;
		console.error(chalk.bgRed.white.bold(this.formatPrefix("fatal")), ...data);
	}
}
