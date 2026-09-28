export const SUPPORTED_LOCALES = [
  { code: "fr", name: "Français" },
  { code: "en", name: "Anglais" },
  { code: "es", name: "Espagnol" },
  { code: "de", name: "Allemand" },
  { code: "pt", name: "Portugais" },
] as const;

export const LOCALE_CODES = SUPPORTED_LOCALES.map((locale) => locale.code) as [
  (typeof SUPPORTED_LOCALES)[number]["code"],
  ...(typeof SUPPORTED_LOCALES)[number]["code"][],
];

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

export function localeLabel(code: string) {
  return SUPPORTED_LOCALES.find((locale) => locale.code === code)?.name ?? code.toUpperCase();
}
