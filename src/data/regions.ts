import type { Region, Site } from '../types';

export const regions: Region[] = [
  {
    id: 'RU-MOW',
    name: 'Московская область',
    coords: [55.45, 37.62],
    rating: 92,
    tax_incentives: true,
    electricity_tariff: 5.2,
    steel_dist: 120,
    insulation_dist: 150,
    social: { urban_index: 245, kindergarten_load: 112, colleges: 22, rent_1room: 45000 },
    economy: { avg_salary: 95000, reduced_insurance: true, ecology_class: 2 },
    cultural: {
      styles: ['Конструктивизм', 'Современная архитектура'],
      materials: ['Кирпич', 'Стекло', 'Бетон'],
      colors_authentic: ['#B22222', '#D3D3D3', '#F5F5DC'],
      colors_techno: ['#2F4F4F', '#A9A9A9', '#FF4500'],
      colors_eco: ['#556B2F', '#8B4513', '#87CEEB'],
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
    social: { urban_index: 210, kindergarten_load: 105, colleges: 18, rent_1room: 28000 },
    economy: { avg_salary: 72000, reduced_insurance: true, ecology_class: 3 },
    cultural: {
      styles: ['Булгарская', 'Современный восточный'],
      materials: ['Керам. кирпич', 'Дерево', 'Мозаика'],
      colors_authentic: ['#8B3A3A', '#D2B48C', '#2E8B57'],
      colors_techno: ['#1C1C1C', '#C0C0C0', '#4682B4'],
      colors_eco: ['#7C9D32', '#CD853F', '#AEEEEE'],
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
    social: { urban_index: 195, kindergarten_load: 98, colleges: 14, rent_1room: 32000 },
    economy: { avg_salary: 65000, reduced_insurance: false, ecology_class: 4 },
    cultural: {
      styles: ['Казачье зодчество', 'Средиземноморский'],
      materials: ['Белый камень', 'Черепица', 'Дерево'],
      colors_authentic: ['#FDF5E6', '#CD5C5C', '#F4A460'],
      colors_techno: ['#696969', '#B0C4DE', '#FFD700'],
      colors_eco: ['#98FB98', '#BC8F8F', '#FFE4B5'],
    },
  },
];

export const sites: Site[] = [
  { id: 'MOW1', region_id: 'RU-MOW', name: 'Промпарк Северный', coords: [55.8, 37.9], railway: true, highway_km: 4, gas: true, power_kva: 1100, cost_land: 85000000, connection_rub_per_kw: 4500 },
  { id: 'MOW2', region_id: 'RU-MOW', name: 'Индустриальный парк Южный', coords: [55.3, 37.6], railway: false, highway_km: 12, gas: true, power_kva: 900, cost_land: 62000000, connection_rub_per_kw: 4800 },
  { id: 'TA1', region_id: 'RU-TA', name: 'ОЭЗ Алабуга', coords: [55.9, 49.2], railway: true, highway_km: 3, gas: true, power_kva: 2000, cost_land: 72000000, connection_rub_per_kw: 3900 },
  { id: 'TA2', region_id: 'RU-TA', name: 'Промзона Казань-Юг', coords: [55.7, 49.1], railway: false, highway_km: 9, gas: true, power_kva: 800, cost_land: 45000000, connection_rub_per_kw: 4100 },
  { id: 'KRD1', region_id: 'RU-KRD', name: 'Промпарк Краснодар-Запад', coords: [45.1, 39.0], railway: true, highway_km: 6, gas: true, power_kva: 950, cost_land: 58000000, connection_rub_per_kw: 5200 },
];
