import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());

export const formatCapitalizedText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const truncateLabel = (
    label: string,
    maxLength: number = 15,
): string => {
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
};

export function biasIndexToText(biasIndex: number): string {
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
