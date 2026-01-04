export type Language = "bn" | "en";

export const DEFAULT_LANGUAGE: Language = "en";
export const SUPPORTED_LANGUAGES: readonly Language[] = ["bn", "en"] as const;

export type ExcuseItem = { _id: number; text: string };
export type ExcuseData = Array<ExcuseItem>;

export function isValidLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}
