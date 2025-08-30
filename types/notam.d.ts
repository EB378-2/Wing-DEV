// types/notam.d.ts
export interface NOTAM {
  id: number;
  code23: string;
  code45: string;
  endvalidity: number;
  estimation: null | string;
  fir: string;
  itema: string[];
  itemd: null | string;
  iteme: string;  // This is the actual NOTAM text
  itemf: null | string;
  itemg: null | string;
  lat: number;
  lon: number;
  lower: number;
  modified: number;
  nelat: number;
  nelon: number;
  nof: string;
  number: number;
  purpose: string;
  radius: number;
  referrednumber: number;
  referredseries: string;
  referredyear: number;
  scope: string;
  series: string;
  startvalidity: number;
  suppressed: boolean;
  swlat: number;
  swlon: number;
  traffic: string;
  type: string;
  upper: number;
  year: number;
}

export interface NOTAMResponse {
  message: string;
  total: number;
  rows: NOTAM[];
}

export interface VerticalLimit {
  reference: 'SFC' | 'AMSL' | 'FLIGHT_LEVEL' | 'AGL' | 'UNL' | 'GND';
  uom?: 'FEET' | 'METERS';
  value?: number;
}

export interface NotamFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
    lowerLimit?: VerticalLimit;
    upperLimit?: VerticalLimit;
  };
  properties: {
    text: string;
    location: string;
    effectiveStart: string;
    effectiveEnd: string;
    qcode: string;
    traffic: 'V' | 'I' | 'IV';
    // Add other properties as needed
  };
}