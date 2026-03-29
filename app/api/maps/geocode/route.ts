import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit } from "@/lib/rateLimit";

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

function getServerKey(): string | null {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  return key && key.trim().length > 0 ? key : null;
}

export async function GET(request: NextRequest) {
  const rateLimit = enforceRateLimit(request, {
    namespace: "maps-geocode",
    maxRequests: 30,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many geocode requests. Please retry shortly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        message: "Query parameter 'q' is required",
      },
      { status: 400 },
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      {
        success: false,
        message: "Query parameter 'q' is too long",
      },
      { status: 400 },
    );
  }

  const serverKey = getServerKey();
  if (!serverKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Server maps key is not configured",
      },
      { status: 500 },
    );
  }

  const url = new URL(GOOGLE_GEOCODE_URL);
  url.searchParams.set("address", query);
  url.searchParams.set("key", serverKey);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as
      | {
          status?: string;
          error_message?: string;
          results?: Array<{
            formatted_address?: string;
            geometry?: {
              location?: {
                lat?: number;
                lng?: number;
              };
            };
          }>;
        }
      | null;

    if (!response.ok || !payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to geocode location",
        },
        { status: 502 },
      );
    }

    if (payload.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          message: payload.error_message || "No matching location found",
          status: payload.status,
        },
        { status: 400 },
      );
    }

    const results = (payload.results || [])
      .map((result) => {
        const lat = result.geometry?.location?.lat;
        const lng = result.geometry?.location?.lng;

        if (typeof lat !== "number" || typeof lng !== "number") {
          return null;
        }

        return {
          formattedAddress: result.formatted_address || "",
          lat,
          lng,
        };
      })
      .filter((item): item is { formattedAddress: string; lat: number; lng: number } => Boolean(item));

    return NextResponse.json({
      success: true,
      data: results,
      message: results.length ? "Geocode results found" : "No matching location found",
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while geocoding location",
      },
      { status: 500 },
    );
  }
}
