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

import { waypointsToGeoJSON } from "@/lib/map/wpToGeoJson";

export default function MapView() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState<MaplibreMap | null>(null);
  const { data: session } = useSession();
  const [waypoints, setWaypoints] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/waypoints")
      .then((res) => res.json())
      .then((data) => setWaypoints(Array.isArray(data.waypoints) ? data.waypoints : []));
  }, []);

  useEffect(() => {
    if (!mapInstance || waypoints.length === 0) return;

    const geojson = waypointsToGeoJSON(waypoints);

    // Clean old source/layers
    if (mapInstance.getLayer("clusters")) mapInstance.removeLayer("clusters");
    if (mapInstance.getLayer("cluster-count")) mapInstance.removeLayer("cluster-count");
    if (mapInstance.getLayer("unclustered-point")) mapInstance.removeLayer("unclustered-point");
    if (mapInstance.getSource("waypoints")) mapInstance.removeSource("waypoints");

    mapInstance.addSource("waypoints", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    mapInstance.addLayer({
      id: "clusters",
      type: "circle",
      source: "waypoints",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#60a5fa",
          10,
          "#3b82f6",
          30,
          "#2563eb",
          100,
          "#1e40af",
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          18,
          10,
          25,
          30,
          32,
          100,
          40,
        ],
        "circle-opacity": 0.85,
        "circle-stroke-width": 3,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": 0.9,
      },
    });

    mapInstance.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "waypoints",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    mapInstance.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "waypoints",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": 7,
        "circle-color": "#3b82f6",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    // Register click & hover handlers ONCE
    const clickHandler = (e: any) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });

      const feature = features[0];
      const clusterId = feature?.properties?.cluster_id;

      if (!clusterId) return;

      const source = mapInstance.getSource("waypoints") as maplibregl.GeoJSONSource;
      if (!source || typeof source.getClusterExpansionZoom !== "function") return;

      source.getClusterExpansionZoom(clusterId as number)
        .then((zoom: number) => {
          mapInstance.easeTo({
            center:
              feature.geometry.type === "Point"
                ? (feature.geometry.coordinates as [number, number])
                : undefined,
            zoom,
          });
        })
    };

    mapInstance.on("click", "clusters", clickHandler);
    mapInstance.on("mouseenter", "clusters", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });
    mapInstance.on("mouseleave", "clusters", () => {
      mapInstance.getCanvas().style.cursor = "";
    });

    return () => {
      if (!mapInstance) return;
      mapInstance.off("click", "clusters", clickHandler);
    };
  }, [mapInstance, waypoints]);

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
