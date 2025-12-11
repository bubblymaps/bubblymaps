"use client";

import { useEffect, useState } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";

function getScale(map: MaplibreMap | null): { meters: number; label: string; pixels: number } {
  if (!map) return { meters: 0, label: "", pixels: 0 };
  // Calculate scale at bottom center of map
  const center = map.getCenter();
  const zoom = map.getZoom();
  // Approximate meters per pixel at equator
  const metersPerPixel = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);
  // Choose a nice round scale bar length in pixels
  const pixelLengths = [100, 150, 200, 250, 300];
  let best: number = pixelLengths[0] ?? 100;
  let meters = metersPerPixel * best;
  for (let px of pixelLengths) {
    const m = metersPerPixel * px;
    if (m > 1000) {
      best = px;
      meters = m;
      break;
    }
    if (m > 100) {
      best = px;
      meters = m;
    }
  }
  let label = meters >= 1000 ? `${(meters/1000).toFixed(1)} km` : `${Math.round(meters)} m`;
  return { meters, label, pixels: best };
}

export function MapScale({ map }: { map: MaplibreMap | null }) {
  const [scale, setScale] = useState<{ meters: number; label: string; pixels?: number }>({ meters: 0, label: "" });

  useEffect(() => {
    if (!map) return;
    const update = () => setScale(getScale(map));
    update();
    map.on("move", update);
    map.on("zoom", update);
    return () => {
      map.off("move", update);
      map.off("zoom", update);
    };
  }, [map]);

  if (!scale.label || !scale.pixels) return null;

  return (
    <div className="absolute left-6 bottom-6 z-10 flex items-center select-none">
      <div
        className="h-2 bg-zinc-300 dark:bg-white rounded transition-all duration-500"
        style={{ width: `${scale.pixels}px` }}
      />
      <span className="ml-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-opacity duration-500 opacity-100">
        {scale.label}
      </span>
    </div>
  );
}
