import { NextRequest } from "next/server";

type RateLimitState = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
};

const store = new Map<string, RateLimitState>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return "unknown-client";
}

function buildKey(request: NextRequest, namespace: string): string {
  const ip = getClientIp(request);
  return `${namespace}:${ip}`;
}

export function enforceRateLimit(
  request: NextRequest,
  options: {
    namespace: string;
    maxRequests: number;
    windowMs: number;
  },
): RateLimitResult {
  const key = buildKey(request, options.namespace);
  const now = Date.now();
  const currentState = store.get(key);

  if (!currentState || currentState.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.max(options.maxRequests - 1, 0),
    };
  }

  if (currentState.count >= options.maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(Math.ceil((currentState.resetAt - now) / 1000), 1),
      remaining: 0,
    };
  }

  currentState.count += 1;
  store.set(key, currentState);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(options.maxRequests - currentState.count, 0),
  };
}
