"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MaplibreMap } from "maplibre-gl";

import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";

import MapBox from "@/components/map/loader.map";
import User from "@/components/user"
import WaypointPopup from "@/components/map/waypoint-popup";

import { Watermark } from "@/components/map/watermark";
import { ThemeToggle } from "@/components/map/controls/theme-toggle";
import { Credit } from "@/components/map/credit";
import { MapZoom } from "@/components/map/controls/map-zoom";
import { MapScale } from "@/components/map/controls/map-scale";
import { SearchBar } from "@/components/map/controls/search-bar";

import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import type { Waypoint } from "@/types/waypoints";

function MapPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<MaplibreMap | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [hasTeleported, setHasTeleported] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [activePopup, setActivePopup] = useState<maplibregl.Popup | null>(null);

  // Only set mapTheme after component is mounted to prevent style thrashing
  const mapTheme = mounted && theme === "dark"
    ? "https://tiles.linus.id.au/styles/dark/style.json"
    : "https://tiles.linus.id.au/styles/light/style.json";

  useEffect(() => setMounted(true), []);

  // On mount, check for ?lat, ?lng, ?zoom and teleport if present, else geolocate
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoom = searchParams.get("zoom");
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setMapCenter([lngNum, latNum]);
        setHasTeleported(true);
      }
    }
    if (zoom) {
      const zoomNum = parseFloat(zoom);
      if (!isNaN(zoomNum)) setMapZoom(zoomNum);
    }
    if (!(lat && lng)) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.longitude === "number" && typeof data.latitude === "number") {
            setMapCenter([data.longitude, data.latitude]);
          } else if (typeof data.longitude === "string" && typeof data.latitude === "string") {
            setMapCenter([parseFloat(data.longitude), parseFloat(data.latitude)]);
          } else {
            setMapCenter([151.21, -33.87]);
          }
        })
        .catch(() => setMapCenter([151.21, -33.87]));
    }
  }, [searchParams]);

  // Track map movement and update URL
  useEffect(() => {
    if (!map) return;
    const onMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const lat = center.lat.toFixed(5);
      const lng = center.lng.toFixed(5);
      const zoomStr = zoom.toFixed(2);
      const params = new URLSearchParams(window.location.search);
      params.set("lat", lat);
      params.set("lng", lng);
      params.set("zoom", zoomStr);
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", url);
    };
    map.on("moveend", onMove);
    return () => {
      map.off("moveend", onMove);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return

    const loadWaypoints = async () => {

      console.log("[ Loader ] Loading waypoints...")
      toast.loading("Loading waypoints...", { id: "load-waypoints" })

      try {
        // Ensure the style is fully loaded before proceeding
        if (!map.isStyleLoaded()) {
          console.log("[ Loader ] Waiting for style to load...")
          await new Promise<void>((resolve) => {
            map.once("styledata", () => resolve())
          })
        }

        const res = await fetch("/api/waypoints")

        if (!res.ok) {
          toast.error(`${res.status} ${res.statusText}`)
          throw new Error(`${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        console.log(`[MapPage] Loaded ${data.waypoints?.length} waypoints`);
        setWaypoints(data.waypoints || []);

        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.waypoints.map((wp: Waypoint) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [wp.longitude, wp.latitude] },
            properties: wp,
          })),
        }
          ;["clusters", "cluster-count", "unclustered-point"].forEach((id) => {
            if (map.getLayer(id)) map.removeLayer(id)
          })

        if (map.getSource("waypoints")) map.removeSource("waypoints")

        map.addSource("waypoints", {
          type: "geojson",
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })



        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "waypoints",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": ["step", ["get", "point_count"], "#4A90E2", 10, "#357ABD", 50, "#1F4C8B"],
            "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 30],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        })

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "waypoints",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        })

        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "waypoints",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#1E90FF",
            "circle-radius": 8,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        })

        const source = map.getSource("waypoints") as maplibregl.GeoJSONSource

        map.on("click", "clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] })
          const clusterId = features[0]?.properties.cluster_id

          source
            .getClusterExpansionZoom(clusterId)
            .then((zoom: number) => {
              map.easeTo({
                center: (features[0]?.geometry as GeoJSON.Point).coordinates as [number, number],
                zoom,
                duration: 500,
              })
            })
            .catch((err: Error) => console.error(err))
        })

        map.on("click", "unclustered-point", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });
          if (!features.length) return;

          const coordinates = (features[0]?.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          const properties = features[0]?.properties as Waypoint;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const popup = document.createElement("div");
          ReactDOM.createRoot(popup).render(
            <WaypointPopup
              waypoint={properties}
              coordinates={coordinates}
              id={properties.id}
            />
          );

          new maplibregl.Popup({ offset: 10 })
            .setLngLat(coordinates)
            .setDOMContent(popup)
            .addTo(map);
        })

        map.on("mouseenter", "clusters", () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", "clusters", () => {
          map.getCanvas().style.cursor = ""
        })

        map.on("mouseenter", "unclustered-point", () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", "unclustered-point", () => {
          map.getCanvas().style.cursor = ""
        })

        if (!map.getSource("waypoints-heatmap")) {
          map.addSource("waypoints-heatmap", {
            type: "geojson",
            data: geojson, // same raw data
          });
        }

        if (!map.getLayer("waypoints-heat")) {
          map.addLayer(
            {
              id: "waypoints-heat",
              type: "heatmap",
              source: "waypoints-heatmap",
              maxzoom: 13,
              paint: {
                "heatmap-weight": 1,
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.3, 10, 0.7, 15, 1.5],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 20, 10, 40, 15, 60],
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0, "rgba(0,0,255,0)",
                  0.1, "rgba(0,60,255,0.15)",
                  0.3, "rgba(0,100,255,0.3)",
                  0.5, "rgba(0,150,255,0.5)",
                  0.7, "rgba(0,200,255,0.7)",
                  1, "rgba(0,255,255,1)"
                ],
                "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0.8, 15, 0],
              },
            },
            "clusters"
          );

        }

        console.log("[ Loader ] Waypoints loaded successfully")
        toast.success("Waypoints loaded successfully", { id: "load-waypoints" })

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(err)
        toast.error(`Failed to load waypoints: ${errorMessage}`, { id: "load-waypoints" })
      }
    }

    const handleStyleLoad = () => {
      console.log("[ Loader ] Style loaded event fired")
      loadWaypoints()
    }

    // Use 'on' instead of 'once' to handle theme changes
    map.on("style.load", handleStyleLoad)

    if (map.isStyleLoaded()) {
      loadWaypoints()
    }

    return () => {
      map.off("style.load", handleStyleLoad)
    }
  }, [map, mapTheme])

  if (!mounted || !mapCenter) {
    return <div className="w-screen h-[100dvh]" />;
  }

  return (
    <div className="w-screen h-[100dvh] relative">
      <MapBox
        styleURL={mapTheme}
        center={mapCenter}
        zoom={mapZoom}
        showControls={false}
        className="w-full h-full"
        onMapLoad={setMap}
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
        <SearchBar 
          waypoints={waypoints}
          onSelect={(waypoint) => {
            if (map) {
              // Close existing popup before opening new one
              if (activePopup) {
                activePopup.remove();
              }

              map.flyTo({
                center: [waypoint.longitude, waypoint.latitude],
                zoom: 18,
                essential: true
              });

              const popupElement = document.createElement("div");
              ReactDOM.createRoot(popupElement).render(
                <WaypointPopup
                  waypoint={waypoint}
                  coordinates={[waypoint.longitude, waypoint.latitude]}
                  id={waypoint.id}
                />
              );

              const newPopup = new maplibregl.Popup({ offset: 10 })
                .setLngLat([waypoint.longitude, waypoint.latitude])
                .setDOMContent(popupElement)
                .addTo(map);

              setActivePopup(newPopup);

              // Clear reference when popup is closed manually
              newPopup.on('close', () => setActivePopup(null));
            }
          }}
        />
      </div>

      <Watermark />
      <Credit />
      <MapZoom map={map} />
      <MapScale map={map} />
    </div>
  );
}

export default MapPage;
