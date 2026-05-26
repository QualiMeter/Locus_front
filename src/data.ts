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
  {
    id: 'RU-MOW',
    name: 'Московская область',
    coords: [55.45, 37.62],

    rating: 92,

    tax_incentives: true,

    electricity_tariff: 5.2,

    steel_dist: 120,
    insulation_dist: 150,

    demand_score: 0.92,

    social: {
      urban_index: 245,
      kindergarten_load: 112,
      colleges: 22,
      rent_1room: 45000,
    },

    economy: {
      avg_salary: 95000,
      reduced_insurance: true,
      ecology_class: 2,
    },

    cultural: {
      styles: [
        'Конструктивизм',
        'Современная архитектура',
      ],

      materials: [
        'Кирпич',
        'Стекло',
        'Бетон',
      ],

      colors_authentic: [
        '#B22222',
        '#D3D3D3',
        '#F5F5DC',
      ],

      colors_techno: [
        '#2F4F4F',
        '#A9A9A9',
        '#FF4500',
      ],

      colors_eco: [
        '#556B2F',
        '#8B4513',
        '#87CEEB',
      ],
    },
  },

  {
    id: 'RU-TA',
    name: 'Республика Татарстан',
    coords: [55.79, 49.12],

    rating: 88,

    tax_incentives: true,

    electricity_tariff: 4.8,

    steel_dist: 210,
    insulation_dist: 180,

    demand_score: 0.85,

    social: {
      urban_index: 210,
      kindergarten_load: 105,
      colleges: 18,
      rent_1room: 28000,
    },

    economy: {
      avg_salary: 72000,
      reduced_insurance: true,
      ecology_class: 3,
    },

    cultural: {
      styles: [
        'Булгарская',
        'Современный восточный',
      ],

      materials: [
        'Керам. кирпич',
        'Дерево',
        'Мозаика',
      ],

      colors_authentic: [
        '#8B3A3A',
        '#D2B48C',
        '#2E8B57',
      ],

      colors_techno: [
        '#1C1C1C',
        '#C0C0C0',
        '#4682B4',
      ],

      colors_eco: [
        '#7C9D32',
        '#CD853F',
        '#AEEEEE',
      ],
    },
  },

  {
    id: 'RU-KRD',
    name: 'Краснодарский край',
    coords: [45.04, 38.98],

    rating: 79,

    tax_incentives: false,

    electricity_tariff: 5.6,

    steel_dist: 350,
    insulation_dist: 220,

    demand_score: 0.76,

    social: {
      urban_index: 195,
      kindergarten_load: 98,
      colleges: 14,
      rent_1room: 32000,
    },

    economy: {
      avg_salary: 65000,
      reduced_insurance: false,
      ecology_class: 4,
    },

    cultural: {
      styles: [
        'Казачье зодчество',
        'Средиземноморский',
      ],

      materials: [
        'Белый камень',
        'Черепица',
        'Дерево',
      ],

      colors_authentic: [
        '#FDF5E6',
        '#CD5C5C',
        '#F4A460',
      ],

      colors_techno: [
        '#696969',
        '#B0C4DE',
        '#FFD700',
      ],

      colors_eco: [
        '#98FB98',
        '#BC8F8F',
        '#FFE4B5',
      ],
    },
  },
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