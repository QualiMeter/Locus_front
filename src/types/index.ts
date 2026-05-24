export type ArchPriority = 'authentic' | 'techno' | 'eco';
export type EcologyClass = 1 | 2 | 3 | 4 | 5;

export interface RegionSocial {
  urban_index: number;
  kindergarten_load: number;
  colleges: number;
  rent_1room: number;
}

export interface RegionEconomy {
  avg_salary: number;
  reduced_insurance: boolean;
  ecology_class: EcologyClass;
}

export interface RegionCultural {
  styles: string[];
  materials: string[];
  colors_authentic: string[];
  colors_techno: string[];
  colors_eco: string[];
}

export interface Region {
  id: string;
  name: string;
  coords: [number, number];
  rating: number;
  tax_incentives: boolean;
  electricity_tariff: number;
  steel_dist: number;
  insulation_dist: number;
  social: RegionSocial;
  economy: RegionEconomy;
  cultural: RegionCultural;
}

export interface Site {
  id: string;
  region_id: string;
  name: string;
  coords: [number, number];
  railway: boolean;
  highway_km: number;
  gas: boolean;
  power_kva: number;
  cost_land: number;
  connection_rub_per_kw: number;
}

export interface FormState {
  volume: number;
  workers: number;
  budget: number;
  railway: boolean;
  highwayDist: number;
  archPriority: ArchPriority;
  amenities: string[];
  housing: number;
  kindergarten: number;
  sports: string[];
}
