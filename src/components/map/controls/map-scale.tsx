"use client";

import { useEffect, useState } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";

function getScale(map: MaplibreMap | null): { label: string; pixels: number } {
  if (!map) return { label: "", pixels: 0 };
  
  // Calculate meters per pixel at the center
  const center = map.getCenter();
  const zoom = map.getZoom();
  // Meters per pixel at this latitude
  const metersPerPixel = 156543.03392 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom);
  
  // The distance steps we want to support
  const steps = [
    1, 2, 5, 10, 20, 50, 100, 200, 500, 
    1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000
  ];

  // We want a bar width around 80-100px
  const targetMeters = metersPerPixel * 100;
  
  // Find closest nice number
  let bestStep = steps[0];
  for (const s of steps) {
    if (s > targetMeters) break;
    bestStep = s;
  }

  // Ensure bestStep is always a number
  bestStep = bestStep ?? steps[0];

  const pixels = bestStep ? bestStep / metersPerPixel : 0;
  const label = bestStep ? (bestStep >= 1000 ? `${bestStep / 1000} km` : `${bestStep} m`) : "";

  return { label, pixels };
}

export function MapScale({ map }: { map: MaplibreMap | null }) {
  const [scale, setScale] = useState<{ label: string; pixels: number }>({ label: "", pixels: 0 });

  useEffect(() => {
    if (!map) return;

    let frameId: number;
    const update = () => {
      setScale(getScale(map));
    };

    const onMove = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    };

    update();
    map.on("move", onMove);
    map.on("zoom", onMove);
    
    return () => {
      map.off("move", onMove);
      map.off("zoom", onMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [map]);

  if (!scale.label || !scale.pixels) return null;

  return (
    <div className="absolute left-4 bottom-4 z-10 flex flex-col items-start select-none pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center gap-2">
        <div
          className="h-2 border-2 border-t-0 border-zinc-900 dark:border-white transition-all duration-200"
          style={{ width: `${scale.pixels}px` }}
        />
        <span className="text-xs font-medium text-zinc-900 dark:text-white whitespace-nowrap shadow-sm">
          {scale.label}
        </span>
      </div>
    </div>
  );
}
