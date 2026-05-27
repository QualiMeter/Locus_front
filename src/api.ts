const API_BASE_URL = 'https://locusback.up.railway.app';

export interface AnalysisInput {
  ProductionVolumeKmsq: number;
  EmployeeCount: number;
  BudgetRubMillion: number;
  NeedsRailway: boolean;
  MaxHighwayDistKm: number;
  ArchPriority: string;
  Amenities: string[];
  HousingPercent: number;
  HousingType: string;
  KindergartenSlots: number;
  Sports: string[];
}

export interface SiteDto {
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
  demand_score?: number;
}

export interface RegionDto {
  id: string;
  name: string;
  coords: [number, number];
  rating: number;
  tax_incentives: boolean;
  electricity_tariff: number;
  steel_dist: number;
  insulation_dist: number;
  demand_score: number;
  social: {
    urban_index: number;
    kindergarten_load: number;
    colleges: number;
    rent_1room: number;
  };
  economy: {
    avg_salary: number;
    reduced_insurance: boolean;
    ecology_class: number;
  };
  cultural: {
    styles: string[];
    materials: string[];
    colors_authentic: string[];
    colors_techno: string[];
    colors_eco: string[];
  };
  top_sites?: SiteDto[];
}

export interface AnalysisResultDto {
  requestId: string;
  topRegions: RegionDto[];
  filteredSites: SiteDto[];
}

export async function analyzeLocation(input: AnalysisInput): Promise<AnalysisResultDto> {
  const response = await fetch(`${API_BASE_URL}/api/analysis/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function fetchCatalog(): Promise<{ regions: RegionDto[]; sites: SiteDto[] }> {
  const [regRes, siteRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/catalog/regions`),
    fetch(`${API_BASE_URL}/api/catalog/sites`),
  ]);
  if (!regRes.ok || !siteRes.ok) throw new Error('Failed to fetch catalog');
  return { regions: await regRes.json(), sites: await siteRes.json() };
}


export async function getRenders(requestId: string): Promise<Array<{ View: string; Url: string }>> {
  const response = await fetch(`${API_BASE_URL}/api/analysis/renders/${requestId}`);

  if (!response.ok) {
    throw new Error(`Failed to get renders: ${response.status}`);
  }

  return response.json();
}
