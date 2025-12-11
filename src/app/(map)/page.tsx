"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MaplibreMap } from "maplibre-gl";

import MapBox from "@/components/map/loader.map";
import { Watermark } from "@/components/map/watermark";
import { ThemeToggle } from "@/components/map/controls/theme-toggle";
import { Credit } from "@/components/map/credit";
import { MapZoom } from "@/components/map/controls/map-zoom";
import { MapScale } from "@/components/map/controls/map-scale";
import { SearchBar } from "@/components/map/controls/search-bar";

import User from "@/components/user"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function MapView() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState<MaplibreMap | null>(null);
  const { data: session } = useSession();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-screen h-screen" />;
  }

  const mapTheme = theme === "dark"
    ? "https://tiles.linus.id.au/styles/dark/style.json"
    : "https://tiles.linus.id.au/styles/light/style.json";

  return (
    <div className="w-screen h-screen relative">
      <MapBox
        styleURL={mapTheme}
        center={[151.21, -33.87]}
        zoom={12}
        showControls={false}
        className="w-full h-full"
        onMapLoad={setMapInstance}
      />

      <div className="absolute top-4 right-4 z-30 flex flex-row gap-2 items-center">
        {!session ? (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="cursor-pointer h-10 px-4 flex items-center justify-center rounded-full border border-input shadow-md transition bg-white text-black dark:bg-zinc-900/80 dark:backdrop-blur-sm dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 font-medium text-sm"
            aria-label="Sign in"
          >
            Sign in
          </button>
        ) : (
          <User />
        )}
        <ThemeToggle />
      </div>

      <div className="absolute top-4 left-4 z-20">
        <SearchBar />
      </div>

      <Watermark />
      <Credit />
      <MapZoom map={mapInstance} />
      <MapScale map={mapInstance} />
    </div>
  );
}
