import type { FeatureCollection, Point, GeoJsonProperties } from "geojson";

export function waypointsToGeoJSON(waypoints: any[]): FeatureCollection<Point, GeoJsonProperties> {
  return {
    type: "FeatureCollection",
    features: waypoints.map((wp) => ({
      type: "Feature",
      properties: { id: wp.id },
      geometry: {
        type: "Point",
        coordinates: [wp.longitude, wp.latitude],
      },
    })),
  };
}