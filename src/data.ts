export interface Region {
  id: string;
  name: string;
  coords: [number, number];

  rating: number;

  tax_incentives: boolean;
  electricity_tariff: number;

  // Логистика
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
  top_sites?: Site[];
}

export interface Site {
  id: string;
  region_id: string;
  name: string;

  coords: [number, number];

  total_area_ha?: number;

  railway: boolean;
  highway_km: number;

  gas: boolean;

  power_kva: number;

  cost_land: number;

  connection_rub_per_kw: number;

  // Логистика сырья
  distance_to_steel_supplier_km?: number;
  distance_to_insulation_supplier_km?: number;

  // Сбыт
  demand_score?: number;
}

export type ArchPriority =
  | 'authentic'
  | 'techno'
  | 'eco';

export type HousingType =
  | 'dormitory'
  | 'apartments';

export interface FormState {
  volume: number | '';

  workers: number | '';

  budget: number | '';

  railway: boolean;

  highwayDist: number;

  archPriority: ArchPriority;

  amenities: string[];

  housing: number;

  housingType: HousingType;

  kindergarten: number;

  sports: string[];
}

export const REGIONS: Region[] = [
  { id: "ARH", name: "Архангельская область", coords: [64.54, 40.54], rating: 75, tax_incentives: false, electricity_tariff: 5.2, steel_dist: 500, insulation_dist: 450, demand_score: 0.52, social: { urban_index: 198, kindergarten_load: 79, colleges: 23, rent_1room: 27800 }, economy: { avg_salary: 73989, reduced_insurance: false, ecology_class: 2 }, cultural: { styles: ["Северное деревянное зодчество", "Классицизм", "Русский стиль"], materials: ["Древесина (сосна, ель)", "Лиственница", "Камень"], colors_authentic: ["#FFFFFF", "#0050A0"], colors_techno: ["#778899", "#C0C0C0"], colors_eco: ["#8FBC8F", "#F5F5DC"] }, top_sites: [] },
  { id: "TA", name: "Республика Татарстан", coords: [55.79, 49.11], rating: 88, tax_incentives: true, electricity_tariff: 5.73, steel_dist: 200, insulation_dist: 100, demand_score: 0.92, social: { urban_index: 240, kindergarten_load: 90, colleges: 33, rent_1room: 30500 }, economy: { avg_salary: 90515, reduced_insurance: true, ecology_class: 3 }, cultural: { styles: ["Булгарская архитектура", "Татарский стиль", "Классицизм"], materials: ["Кирпич (известковый раствор)", "Дерево", "Изразцовая плитка"], colors_authentic: ["#8B3A3A", "#FFFFFF", "#2E8B57"], colors_techno: ["#1C1C1C", "#C0C0C0", "#4682B4"], colors_eco: ["#7C9D32", "#CD853F", "#AEEEEE"] }, top_sites: [] },
  { id: "LEN", name: "Ленинградская область", coords: [59.93, 30.34], rating: 85, tax_incentives: false, electricity_tariff: 5.7, steel_dist: 140, insulation_dist: 40, demand_score: 0.73, social: { urban_index: 237, kindergarten_load: 97, colleges: 12, rent_1room: 27500 }, economy: { avg_salary: 94348, reduced_insurance: false, ecology_class: 3 }, cultural: { styles: ["Деревянное зодчество", "Конструктивизм", "Классицизм"], materials: ["Древесина (сосна, ель)", "Пудостский камень", "Кирпич"], colors_authentic: ["#FFFFFF", "#D21034", "#0050A0"], colors_techno: ["#708090", "#B0C4DE", "#2F4F4F"], colors_eco: ["#556B2F", "#8B4513", "#87CEEB"] }, top_sites: [] },
  { id: "BA", name: "Республика Башкортостан", coords: [54.74, 55.96], rating: 80, tax_incentives: true, electricity_tariff: 5.73, steel_dist: 150, insulation_dist: 120, demand_score: 0.80, social: { urban_index: 236, kindergarten_load: 94, colleges: 10, rent_1room: 25200 }, economy: { avg_salary: 72300, reduced_insurance: false, ecology_class: 4 }, cultural: { styles: ["Тюркская юрта", "Классицизм", "Советский неоклассицизм"], materials: ["Дерево", "Войлок", "Кожа", "Саманный кирпич"], colors_authentic: ["#0050A0", "#FFFFFF", "#2E8B57"], colors_techno: ["#696969", "#B0C4DE", "#FFD700"], colors_eco: ["#98FB98", "#BC8F8F", "#FFE4B5"] }, top_sites: [] },
  { id: "KEM", name: "Кемеровская область", coords: [54.30, 86.67], rating: 76, tax_incentives: false, electricity_tariff: 5.5, steel_dist: 50, insulation_dist: 80, demand_score: 0.70, social: { urban_index: 197, kindergarten_load: 95, colleges: 8, rent_1room: 23000 }, economy: { avg_salary: 81900, reduced_insurance: false, ecology_class: 5 }, cultural: { styles: ["Сибирское барокко", "Классицизм", "Деревянное зодчество"], materials: ["Древесина", "Кирпич", "Камень"], colors_authentic: ["#D21034", "#0050A0", "#000000"], colors_techno: ["#2F4F4F", "#708090", "#B8860B"], colors_eco: ["#556B2F", "#8B4513", "#87CEEB"] }, top_sites: [] },
  { id: "VRN", name: "Воронежская область", coords: [51.67, 39.21], rating: 78, tax_incentives: false, electricity_tariff: 6.0, steel_dist: 100, insulation_dist: 90, demand_score: 0.72, social: { urban_index: 214, kindergarten_load: 91, colleges: 5, rent_1room: 24000 }, economy: { avg_salary: 75524, reduced_insurance: false, ecology_class: 3 }, cultural: { styles: ["Русский стиль", "Эклектика", "Сталинский ампир"], materials: ["Саманный кирпич", "Красный кирпич", "Дерево"], colors_authentic: ["#D21034", "#FFD700", "#FFFFFF"], colors_techno: ["#696969", "#B0C4DE", "#FFD700"], colors_eco: ["#98FB98", "#BC8F8F", "#FFE4B5"] }, top_sites: [] },
  { id: "ORB", name: "Оренбургская область", coords: [51.77, 55.10], rating: 79, tax_incentives: true, electricity_tariff: 5.4, steel_dist: 18, insulation_dist: 265, demand_score: 0.68, social: { urban_index: 224, kindergarten_load: 82, colleges: 6, rent_1room: 22849 }, economy: { avg_salary: 72212, reduced_insurance: false, ecology_class: 4 }, cultural: { styles: ["Краснокирпичный стиль", "Эклектика", "Конструктивизм"], materials: ["Красный кирпич", "Железобетон", "Облицовочная керамика"], colors_authentic: ["#D21034", "#FFD700", "#0050A0"], colors_techno: ["#696969", "#B0C4DE", "#FFD700"], colors_eco: ["#98FB98", "#BC8F8F", "#FFE4B5"] }, top_sites: [] },
  { id: "RZN", name: "Рязанская область", coords: [54.63, 39.74], rating: 77, tax_incentives: false, electricity_tariff: 6.0, steel_dist: 45, insulation_dist: 100, demand_score: 0.77, social: { urban_index: 216, kindergarten_load: 85, colleges: 4, rent_1room: 26000 }, economy: { avg_salary: 71400, reduced_insurance: false, ecology_class: 4 }, cultural: { styles: ["Русский стиль", "Классицизм", "Деревянное зодчество"], materials: ["Древесина", "Белый камень", "Красный кирпич"], colors_authentic: ["#FFFFFF", "#FFD700", "#D21034"], colors_techno: ["#708090", "#B0C4DE", "#2F4F4F"], colors_eco: ["#556B2F", "#8B4513", "#87CEEB"] }, top_sites: [] }
];

export const SITES: Site[] = [
  {
    id: 'MOW1',

    region_id: 'RU-MOW',

    name: 'Промпарк Северный',

    coords: [55.8, 37.9],

    total_area_ha: 12.5,

    railway: true,

    highway_km: 4,

    gas: true,

    power_kva: 1100,

    cost_land: 85000000,

    connection_rub_per_kw: 4500,

    distance_to_steel_supplier_km: 120,

    distance_to_insulation_supplier_km: 150,

    demand_score: 0.92,
  },

  {
    id: 'MOW2',

    region_id: 'RU-MOW',

    name: 'Индустриальный парк Южный',

    coords: [55.3, 37.6],

    total_area_ha: 8.2,

    railway: false,

    highway_km: 12,

    gas: true,

    power_kva: 900,

    cost_land: 62000000,

    connection_rub_per_kw: 4800,

    distance_to_steel_supplier_km: 135,

    distance_to_insulation_supplier_km: 160,

    demand_score: 0.88,
  },

  {
    id: 'TA1',

    region_id: 'RU-TA',

    name: 'ОЭЗ Алабуга',

    coords: [55.9, 49.2],

    total_area_ha: 20.0,

    railway: true,

    highway_km: 3,

    gas: true,

    power_kva: 2000,

    cost_land: 72000000,

    connection_rub_per_kw: 3900,

    distance_to_steel_supplier_km: 210,

    distance_to_insulation_supplier_km: 180,

    demand_score: 0.85,
  },

  {
    id: 'KRD1',

    region_id: 'RU-KRD',

    name: 'Промпарк Краснодар-Запад',

    coords: [45.1, 39.0],

    total_area_ha: 10.0,

    railway: true,

    highway_km: 6,

    gas: true,

    power_kva: 950,

    cost_land: 58000000,

    connection_rub_per_kw: 5200,

    distance_to_steel_supplier_km: 350,

    distance_to_insulation_supplier_km: 220,

    demand_score: 0.76,
  },
];