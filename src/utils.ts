import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type Language = "bn" | "en";
export const DEFAULT_LANGUAGE: Language = "en";
export const SUPPORTED_LANGUAGES: readonly Language[] = ["bn", "en"] as const;

type ExcuseData = Array<{ text: string }>;

let dataMap: Record<Language, ExcuseData> | null = null;

function loadData(): Record<Language, ExcuseData> {
  if (dataMap) return dataMap;

  try {
    const bnData = JSON.parse(
      readFileSync(join(__dirname, "../data/bn.json"), "utf-8"),
    ) as ExcuseData;

    const enData = JSON.parse(
      readFileSync(join(__dirname, "../data/en.json"), "utf-8"),
    ) as ExcuseData;

    dataMap = { bn: bnData, en: enData };
    return dataMap;
  } catch (error) {
    throw new Error(
      `Failed to load excuse data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

function getData(lang: Language): ExcuseData {
  const data = loadData()[lang];
  if (!data || data.length === 0) {
    throw new Error(`No excuses found for language: ${lang}`);
  }
  return data;
}

export function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

export function getRandomExcuse(lang: Language = DEFAULT_LANGUAGE): string {
  const data = getData(lang);
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].text;
}

export function getAllExcuses(lang: Language = DEFAULT_LANGUAGE): string[] {
  return getData(lang).map((item) => item.text);
}

export function getExcuseCount(lang: Language = DEFAULT_LANGUAGE): number {
  return getData(lang).length;
}

export const COLORS = {
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RESET: "\x1b[0m",
} as const;

export const ERROR_MESSAGES = {
  INVALID_LANGUAGE: (lang: string) =>
    `Oops! Invalid language: ${lang}. Use "bn" for Bengali or "en" for English.`,
  GENERIC_ERROR: `Oops! Something went wrong. Please try again or use "npx excuz --help" for help.`,
} as const;

export function handleError(error: unknown, lang?: string): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (errorMessage.includes("language") || errorMessage.includes("Invalid")) {
    process.stdout.write(
      `${COLORS.YELLOW}${ERROR_MESSAGES.INVALID_LANGUAGE(lang || "unknown")}${
        COLORS.RESET
      }\n`,
    );
  } else {
    process.stdout.write(
      `${COLORS.YELLOW}${ERROR_MESSAGES.GENERIC_ERROR}${COLORS.RESET}\n`,
    );
  }
  process.exit(0);
}

export function handleLanguageOption(lang: string | undefined): Language {
  if (!lang) return DEFAULT_LANGUAGE;
  if (isValidLanguage(lang)) return lang;
  throw new Error(`Invalid language: ${lang}. Use "bn" or "en"`);
}
