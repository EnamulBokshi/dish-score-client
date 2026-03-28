export function resolveMediaUrl(path?: string | null): string | null {
  if (!path || path.trim().length === 0) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return path;
  }

  const normalizedBase = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

export function resolveMediaUrls(paths?: string[] | null): string[] {
  if (!paths || paths.length === 0) {
    return [];
  }

  return paths
    .map((path) => resolveMediaUrl(path))
    .filter((value): value is string => Boolean(value));
}
