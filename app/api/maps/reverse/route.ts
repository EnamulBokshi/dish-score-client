import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit } from "@/lib/rateLimit";

const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

type AddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

function getServerKey(): string | null {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  return key && key.trim().length > 0 ? key : null;
}

function parseCoordinate(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function findComponent(
  components: AddressComponent[] | undefined,
  expectedTypes: string[],
): string {
  if (!components?.length) {
    return "";
  }

  const match = components.find((component) =>
    expectedTypes.every((expectedType) => component.types?.includes(expectedType)),
  );

  return match?.long_name || match?.short_name || "";
}

function resolveCity(components: AddressComponent[] | undefined): string {
  return (
    findComponent(components, ["locality"]) ||
    findComponent(components, ["postal_town"]) ||
    findComponent(components, ["administrative_area_level_2"]) ||
    ""
  );
}

function resolveState(components: AddressComponent[] | undefined): string {
  return findComponent(components, ["administrative_area_level_1"]) || "";
}

function resolveRoad(components: AddressComponent[] | undefined): string {
  const route = findComponent(components, ["route"]);
  const streetNumber = findComponent(components, ["street_number"]);

  if (route && streetNumber) {
    return `${streetNumber} ${route}`;
  }

  return route || streetNumber || findComponent(components, ["premise"]) || "";
}

export async function GET(request: NextRequest) {
  const rateLimit = enforceRateLimit(request, {
    namespace: "maps-reverse",
    maxRequests: 40,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many reverse geocode requests. Please retry shortly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  const lat = parseCoordinate(request.nextUrl.searchParams.get("lat"));
  const lng = parseCoordinate(request.nextUrl.searchParams.get("lng"));

  if (lat === null || lng === null) {
    return NextResponse.json(
      {
        success: false,
        message: "Query parameters 'lat' and 'lng' are required numbers",
      },
      { status: 400 },
    );
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      {
        success: false,
        message: "Coordinates are out of valid range",
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
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", serverKey);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    const payload = (await response.json().catch(() => null)) as
      | {
          status?: string;
          error_message?: string;
          results?: Array<{
            formatted_address?: string;
            address_components?: AddressComponent[];
          }>;
        }
      | null;

    if (!response.ok || !payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reverse geocode location",
        },
        { status: 502 },
      );
    }

    if (payload.status !== "OK") {
      return NextResponse.json(
        {
          success: false,
          message: payload.error_message || "No address found for coordinates",
          status: payload.status,
        },
        { status: 400 },
      );
    }

    const primaryResult = payload.results?.[0];
    const formattedAddress = primaryResult?.formatted_address || "";
    const components = primaryResult?.address_components;
    const parsedAddress = {
      city: resolveCity(components),
      state: resolveState(components),
      road: resolveRoad(components),
    };

    return NextResponse.json({
      success: true,
      data: {
        lat,
        lng,
        formattedAddress,
        ...parsedAddress,
      },
      message: formattedAddress ? "Address resolved" : "Address not found",
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error while reverse geocoding",
      },
      { status: 500 },
    );
  }
}
