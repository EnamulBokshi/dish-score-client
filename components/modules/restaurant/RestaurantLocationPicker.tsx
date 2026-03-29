"use client";

import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

import { FORM_FIELD_CLASSNAME } from "@/lib/formFieldStyles";
import { Input } from "@/components/ui/input";

type MapResult = {
  formattedAddress: string;
  lat: number;
  lng: number;
};

type ResolvedAddressDetails = {
  formattedAddress?: string;
  city?: string;
  state?: string;
  road?: string;
};

interface RestaurantLocationPickerProps {
  lat?: string;
  lng?: string;
  disabled?: boolean;
  onCoordinatesChange: (next: {
    lat: string;
    lng: string;
  } & ResolvedAddressDetails) => void;
}

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };

function toFiniteNumber(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function RestaurantLocationPicker({
  lat,
  lng,
  disabled,
  onCoordinatesChange,
}: RestaurantLocationPickerProps) {
  const browserKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string>("");

  const { isLoaded, loadError } = useJsApiLoader({
    id: "restaurant-location-picker-map",
    googleMapsApiKey: browserKey || "",
  });

  const selectedPosition = useMemo(() => {
    const parsedLat = toFiniteNumber(lat);
    const parsedLng = toFiniteNumber(lng);

    if (parsedLat === null || parsedLng === null) {
      return null;
    }

    return { lat: parsedLat, lng: parsedLng };
  }, [lat, lng]);

  const mapCenter = selectedPosition || DEFAULT_CENTER;

  useEffect(() => {
    if (!selectedPosition) {
      return;
    }

    setHelperMessage(null);
  }, [selectedPosition]);

  const resolveAddress = async (nextLat: number, nextLng: number) => {
    setIsResolvingAddress(true);

    try {
      const response = await fetch(`/api/maps/reverse?lat=${nextLat}&lng=${nextLng}`);
      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            data?: ResolvedAddressDetails;
          }
        | null;

      if (!response.ok || !payload?.success) {
        setHelperMessage(payload?.message || "Could not resolve address for the selected point");
        return;
      }

      const formattedAddress = payload.data?.formattedAddress || "";
      setResolvedAddress(formattedAddress);
      onCoordinatesChange({
        lat: nextLat.toFixed(6),
        lng: nextLng.toFixed(6),
        formattedAddress,
        city: payload.data?.city,
        state: payload.data?.state,
        road: payload.data?.road,
      });
    } catch (_error) {
      setHelperMessage("Unexpected error while resolving location address");
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (disabled || !event.latLng) {
      return;
    }

    const nextLat = event.latLng.lat();
    const nextLng = event.latLng.lng();

    onCoordinatesChange({
      lat: nextLat.toFixed(6),
      lng: nextLng.toFixed(6),
    });

    void resolveAddress(nextLat, nextLng);
  };

  useEffect(() => {
    if (disabled || !browserKey) {
      return;
    }

    const query = searchQuery.trim();
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setHelperMessage(null);

      try {
        const response = await fetch(`/api/maps/geocode?q=${encodeURIComponent(query)}`);
        const payload = (await response.json().catch(() => null)) as
          | {
              success?: boolean;
              message?: string;
              data?: MapResult[];
            }
          | null;

        if (!isActive) {
          return;
        }

        if (!response.ok || !payload?.success) {
          setSearchResults([]);
          setHelperMessage(payload?.message || "No location found");
          return;
        }

        const results = (payload.data || []).slice(0, 5);
        setSearchResults(results);

        if (results.length === 0) {
          setHelperMessage("No matching locations found");
        }
      } catch (_error) {
        if (!isActive) {
          return;
        }
        setSearchResults([]);
        setHelperMessage("Unexpected error while searching location");
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [browserKey, disabled, searchQuery]);

  const handleSelectResult = (result: MapResult) => {
    setSearchResults([]);
    setSearchQuery(result.formattedAddress);
    setResolvedAddress(result.formattedAddress);
    setHelperMessage(null);

    onCoordinatesChange({
      lat: result.lat.toFixed(6),
      lng: result.lng.toFixed(6),
      formattedAddress: result.formattedAddress,
    });
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search area, road, or landmark"
          disabled={disabled || !browserKey}
          className={FORM_FIELD_CLASSNAME}
        />
        <p className="text-xs text-muted-foreground">
          Type at least 3 characters to get location suggestions.
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="max-h-36 overflow-y-auto rounded-md border border-white/16 bg-[#111525] p-2">
          <div className="space-y-1">
            {searchResults.map((result) => (
              <button
                key={`${result.lat}-${result.lng}-${result.formattedAddress}`}
                type="button"
                className="w-full rounded px-2 py-1 text-left text-sm text-[#edf1fb] transition hover:bg-white/10"
                onClick={() => handleSelectResult(result)}
                disabled={disabled}
              >
                {result.formattedAddress}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!browserKey ? (
        <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
          `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` is missing. Map picker is unavailable.
        </div>
      ) : loadError ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          Failed to load Google Maps script. You can still enter lat/lng manually.
        </div>
      ) : !isLoaded ? (
        <div className="rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
          Loading map...
        </div>
      ) : (
        <GoogleMap
          center={mapCenter}
          zoom={selectedPosition ? 15 : 12}
          mapContainerClassName="h-72 w-full rounded-md border border-border"
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            clickableIcons: false,
            keyboardShortcuts: !disabled,
            gestureHandling: disabled ? "none" : "auto",
          }}
        >
          {selectedPosition ? <MarkerF position={selectedPosition} /> : null}
        </GoogleMap>
      )}

      {(resolvedAddress || helperMessage || isResolvingAddress) && (
        <p className="text-xs text-muted-foreground">
          {isResolvingAddress
            ? "Resolving address from selected point..."
            : isSearching
              ? "Searching places..."
              : helperMessage || (resolvedAddress ? `Selected: ${resolvedAddress}` : "")}
        </p>
      )}
    </div>
  );
}
