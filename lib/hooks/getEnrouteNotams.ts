import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "geojson";

// departure & arrival
const dep: [number, number] = [24.5748, 60.1905]; // [lon, lat] EFHK
const arr: [number, number] = [22.1940, 59.2009]; // [lon, lat] destination

// Create route line
const routeLine = turf.lineString([dep, arr]);

// Corridor = 10nm (10 nautical miles ≈ 18520 meters)
const corridor: Feature<Polygon | MultiPolygon> = turf.buffer(routeLine, 18520, {
  units: "meters",
}) as Feature<Polygon | MultiPolygon>;

function getAirspacesAlongRoute(
  airspaces: any[],
  corridor: Feature<Polygon | MultiPolygon>
) {
  return airspaces.filter((airspace) => {
    if (!airspace.geometry) return false;

    // Wrap into proper GeoJSON Feature
    const airspacePoly: Feature<Polygon | MultiPolygon> = {
      type: "Feature",
      properties: {},
      geometry: airspace.geometry,
    };

    return turf.booleanIntersects(corridor, airspacePoly);
  });
}

function filterRelevantNotams(notams: any[], relevantAirspaces: any[]) {
  const relevantIds = new Set(relevantAirspaces.map((a) => a.id));

  return notams.filter((notam) => {
    if (!notam.airspaces) return false;
    return notam.airspaces.some((asId: string) => relevantIds.has(asId));
  });
}

export function getEnrouteNotams(
  dep: [number, number],
  arr: [number, number],
  airspaces: any[],
  notams: any[]
) {
  // 1. Route corridor
  const routeLine = turf.lineString([dep, arr]);
  const corridor: Feature<Polygon | MultiPolygon> = turf.buffer(routeLine, 18520, {
    units: "meters",
  }) as Feature<Polygon | MultiPolygon>;

  // 2. Relevant airspaces
  const relevantAirspaces = getAirspacesAlongRoute(airspaces, corridor);

  // 3. Relevant NOTAMs
  const enrouteNotams = filterRelevantNotams(notams, relevantAirspaces);

  return { corridor, relevantAirspaces, enrouteNotams };
}
