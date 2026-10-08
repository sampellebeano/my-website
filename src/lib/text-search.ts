export function normaliseText(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function matchesQuery(text: string, query: string): boolean {
  const words = normaliseText(query.trim()).split(/\s+/).filter(Boolean);
  const haystack = normaliseText(text);
  return words.every(word => haystack.includes(word));
}
