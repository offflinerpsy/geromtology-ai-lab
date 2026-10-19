/** Decimal text entry, including pasted scientific notation and decimal commas. */
export function numericInput(value: string): number {
  const normalized = value.trim().replace(',', '.');
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized) ? Number(normalized) : NaN;
}
