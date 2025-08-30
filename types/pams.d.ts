// types/pams.d.ts
export interface PAMSDocument {
  docid: number;
  heading: string;
  filename: string;
  authority: string;
  language: string;
  filesize?: number;
  effectivestartdate?: number;
  effectiveenddate?: number | null;
  airport?: string;
  aiptype?: string;
  section?: string;
}

export interface AirportPAMSResponse {
  icao: string;
  name: string;
  Airport: PAMSDocument[];
  Arrival: PAMSDocument[];
  Departure: PAMSDocument[];
  Approach: PAMSDocument[];
  VFR: PAMSDocument[];
}

export interface AuthorityStructure {
  code: string;
  name: string;
}