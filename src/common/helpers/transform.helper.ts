export class TransformHelper {
  public static trim({ value }: { value: string }): string {
    return value ? value.trim() : value;
  }

  public static trimArray({ value }) {
    return value ? value.map((item) => item.trim()) : value;
  }

  public static toLowerCase({ value }: { value: string }): string {
    return value ? value.toLowerCase() : value;
  }

  public static toUpperCase({ value }: { value: string }): string {
    return value ? value.toUpperCase() : value;
  }

  public static uniqueItems({ value }) {
    return value ? Array.from(new Set(value)) : value;
  }

  public static toLowerCaseArray({ value }) {
    return value ? value.map((item) => item.toLowerCase()) : value;
  }

  // Useful for query params like: ?categories=bar&categories=pub OR ?categories=bar,pub
  public static toArray({ value }) {
    if (value === undefined || value === null) return value;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [value];
  }
}
