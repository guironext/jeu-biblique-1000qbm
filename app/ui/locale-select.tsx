import { SUPPORTED_LOCALES } from "@/lib/locales";

export function LocaleSelect({
  id = "locale",
  name = "locale",
  defaultValue,
  className,
  placeholder,
}: {
  id?: string;
  name?: string;
  defaultValue?: string;
  className: string;
  placeholder?: string;
}) {
  return (
    <select
      id={id}
      name={name}
      required
      defaultValue={defaultValue ?? ""}
      className={className}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {SUPPORTED_LOCALES.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.name}
        </option>
      ))}
    </select>
  );
}
