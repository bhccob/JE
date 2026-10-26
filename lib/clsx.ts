type ClassValue = string | number | false | null | undefined;

export function clsx(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ');
}
