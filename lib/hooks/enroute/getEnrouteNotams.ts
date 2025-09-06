import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon, Point } from "geojson";

// Each NOTAM should have lat/lon
interface Notam {
  id: number;
  lat: number;
  lon: number;
  description: string;
}

// Each airspace has a geometry polygon
interface Airspace {
  id: string;
  geometry: Feature<Polygon | MultiPolygon>;
  name: string;
  // ...other fields
}

function getAirspacesAlongRoute(
  airspacesData: any, // full API response
  corridor: Feature<Polygon | MultiPolygon>
) {
  // Extract the array from the API response
  const airspacesArray = Array.isArray(airspacesData?.items) ? airspacesData.items : [];


  return airspacesArray.filter((airspace: any) => {
    if (!airspace.geometry) return false;

    const airspacePoly: Feature<Polygon | MultiPolygon> = {
      type: "Feature",
      properties: {},
      geometry: airspace.geometry,
    };

    return turf.booleanIntersects(corridor, airspacePoly);
  });
}



function filterRelevantNotams(notams: any[], relevantAirspaces: any[]) {
  if (!Array.isArray(notams)) {
    console.warn("Expected notams array, got:", notams);
    return [];
  }

  const relevantIds = new Set(relevantAirspaces.map((a) => a.id));

  return notams.filter((notam) => {
    if (!Array.isArray(notam.airspaces) || notam.airspaces.length === 0) return false;

    return notam.airspaces.some((as: any) => {
      const asId = typeof as === "string" ? as : as.id;
      return relevantIds.has(asId);
    });
  });
}

function filterNotamsByAirspace(notamsObj: any, airspaces: Airspace[]) {
  const notamsArray = Array.isArray(notamsObj.notams) ? notamsObj.notams : [];
  console.log(`Total NOTAMs to process: ${notamsArray.length}`);
  console.log(`Total Airspaces: ${airspaces.length}`);

  return notamsArray.filter((notam: Notam) => {
    // Convert coordinates from scaled integer to decimal degrees
    const lon = notam.lon / 1_000_0000;
    const lat = notam.lat / 1_000_0000;
    const point = turf.point([lon, lat]);

    console.log(`\nChecking NOTAM ID ${notam.id}: [${lon}, ${lat}] - "${notam.description}"`);

    const matchesAirspace = airspaces.some((airspace) => {
      if (!airspace.geometry) {
        console.log(`-- Airspace ${airspace.id} has no geometry, skipping`);
        return false;
      }

      const inside = turf.booleanPointInPolygon(point, airspace.geometry as any);
      console.log(
        `-- Airspace ${airspace.id} (${airspace.name}) => ${inside ? "INSIDE" : "outside"}`
      );
      return inside;
    });

    if (!matchesAirspace) {
      console.log(`NOTAM ID ${notam.id} does not intersect any airspace`);
    } else {
      console.log(`NOTAM ID ${notam.id} intersects at least one airspace`);
    }

    return matchesAirspace;
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

  
  const relevantAirspaces = getAirspacesAlongRoute(airspaces, corridor);
  const enrouteNotams = filterRelevantNotams(notams, relevantAirspaces);
  const inAirspaceNotams = filterNotamsByAirspace(notams, relevantAirspaces);
  console.log("getEnrouteNotams:", { corridor, relevantAirspaces, enrouteNotams, inAirspaceNotams });

  return { corridor, relevantAirspaces, enrouteNotams, inAirspaceNotams };
}
