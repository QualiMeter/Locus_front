import { useMemo, useState, useEffect } from 'react';
import { openRouterService } from './services/openRouterService';
import {
  REGIONS,
  SITES,
  FormState,
  ArchPriority,
  HousingType,
} from './data';
import { NumericInput } from './components/NumericInput';
import { MapView } from './components/MapView';
import { ConceptBoard } from './components/ConceptBoard';
import { Analytics } from './components/Analytics';
import { PresentationButton } from './components/PresentationButton';
import styles from './App.module.css';
import {
  analyzeLocation,
  fetchCatalog,
  AnalysisResultDto,
  RegionDto,
  SiteDto,
} from './api';

const DEFAULT_FORM: FormState = {
  volume: 300,
  workers: 80,
  budget: 150,
  railway: false,
  highwayDist: 15,
  archPriority: 'authentic',
  amenities: [],
  housing: 30,
  housingType: 'dormitory',
  kindergarten: 15,
  sports: [],
};

const AMENITIES_OPTIONS = [
  'Аллея', 'Сквер с фонтаном', 'Беседки', 'Сцена', 'Тропа здоровья', 'Пруд', 'Арт-объект',
];
const SPORTS_OPTIONS = [
  'Уличные тренажёры', 'Стадион', 'Бассейн', 'Спортзал', 'Хоккейная коробка',
];

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function App() {
  // Инициализация OpenRouter
const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
if (openRouterKey) {
  openRouterService.configure({ apiKey: openRouterKey });
  console.log('✅ OpenRouter API настроен');
} else {
  console.log('⚠️ OpenRouter API ключ не найден');
}
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [activeRegionIdx, setActiveRegionIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
  );

  const [allData, setAllData] = useState<{ regions: RegionDto[]; sites: SiteDto[] } | null>(null);
  const [apiResults, setApiResults] = useState<AnalysisResultDto | null>(null);

  useEffect(() => {
    fetchCatalog()
      .then((data) => setAllData(data))
      .catch((err) => {
        console.error(err);
        setAllData({ regions: REGIONS as any, sites: SITES as any });
      });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isSearched = apiResults !== null;
  const displayRegions = isSearched
    ? apiResults!.topRegions
    : (allData?.regions || REGIONS);

  const displaySites = isSearched
    ? apiResults!.filteredSites
    : (allData?.sites || SITES);

  const sortedRegions = useMemo(
    () => [...displayRegions].sort((a, b) => b.rating - a.rating),
    [displayRegions],
  );

  useEffect(() => {
    if (activeRegionIdx >= sortedRegions.length) {
      setActiveRegionIdx(0);
    }
  }, [sortedRegions, activeRegionIdx]);

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeLocation({
        ProductionVolumeKmsq: form.volume as number,
        EmployeeCount: form.workers as number,
        BudgetRubMillion: form.budget as number,
        NeedsRailway: form.railway,
        MaxHighwayDistKm: form.highwayDist,
        ArchPriority: form.archPriority,
        Amenities: form.amenities,
        HousingPercent: form.housing,
        HousingType: form.housingType,
        KindergartenSlots: form.kindergarten,
        Sports: form.sports,
      });
      setApiResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запроса');
      setApiResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setApiResults(null);
    setError(null);
    setActiveRegionIdx(0);
  };

  const activeRegion = sortedRegions?.length
    ? sortedRegions[Math.min(activeRegionIdx, sortedRegions.length - 1)]
    : displayRegions?.[0];

  const bestSiteInRegion = (activeRegion as any)?.top_sites?.[0];
  const siteForAnalytics = bestSiteInRegion
    || displaySites?.find((s) => s?.region_id === activeRegion?.id)
    || displaySites?.[0];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>L</span>
          <span className={styles.logoText}>LOCUS</span>
        </div>
        <div className={styles.headerSub}>Умный подбор локации для производства сэндвич-панелей</div>
        <button className={styles.themeBtn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀ Светлая' : '🌙 Тёмная'}
        </button>
      </header>

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <div className={styles.asideInner}>
            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}><span className={styles.formBlockIcon}>📦</span>Производство</div>
              <div className={styles.formFields}>
                <NumericInput label="Объём выпуска" value={form.volume} min={100} max={1000} step={10} unit="тыс. м²/год" onChange={(v) => setForm((f) => ({ ...f, volume: v }))} />
                <NumericInput label="Сотрудники" value={form.workers} min={10} max={300} step={5} unit="чел." onChange={(v) => setForm((f) => ({ ...f, workers: v }))} />
                <NumericInput label="Бюджет" value={form.budget} min={10} max={300} step={5} unit="млн ₽" onChange={(v) => setForm((f) => ({ ...f, budget: v }))} />
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}><span className={styles.formBlockIcon}>🚚</span>Логистика</div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Ж/Д ветка</label>
                  <select className={styles.select} value={form.railway ? 'true' : 'false'} onChange={(e) => setForm((f) => ({ ...f, railway: e.target.value === 'true' }))}>
                    <option value="false">Не требуется</option>
                    <option value="true">Требуется</option>
                  </select>
                </div>
                <NumericInput label="Макс. расстояние до трассы" value={form.highwayDist} min={1} max={100} step={1} unit="км" onChange={(v) => setForm((f) => ({ ...f, highwayDist: v }))} />
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}><span className={styles.formBlockIcon}>🎨</span>Архитектура</div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Архитектурный приоритет</label>
                  <select className={styles.select} value={form.archPriority} onChange={(e) => setForm((f) => ({ ...f, archPriority: e.target.value as ArchPriority }))}>
                    <option value="authentic">Аутентичность региону</option>
                    <option value="techno">Техно-стиль</option>
                    <option value="eco">Экодизайн</option>
                  </select>
                </div>
                <div className={styles.chipGroupWrap}>
                  <label className={styles.selectLabel}>Благоустройство</label>
                  <div className={styles.chipGroup}>
                    {AMENITIES_OPTIONS.map((o) => (
                      <button key={o} type="button" className={`${styles.chip} ${form.amenities.includes(o) ? styles.chipActive : ''}`} onClick={() => setForm((f) => ({ ...f, amenities: toggleArr(f.amenities, o) }))}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}><span className={styles.formBlockIcon}>🤝</span>Социальные приоритеты</div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Обеспечение жильём</label>
                  <select className={styles.select} value={form.housing} onChange={(e) => setForm((f) => ({ ...f, housing: parseInt(e.target.value) }))}>
                    <option value={0}>0%</option><option value={30}>30%</option><option value={50}>50%</option><option value={70}>70%</option>
                  </select>
                </div>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Тип жилья</label>
                  <select className={styles.select} value={form.housingType} onChange={(e) => setForm((f) => ({ ...f, housingType: e.target.value as HousingType }))}>
                    <option value="dormitory">Общежитие</option><option value="apartments">Квартиры</option>
                  </select>
                </div>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Детский сад</label>
                  <select className={styles.select} value={form.kindergarten} onChange={(e) => setForm((f) => ({ ...f, kindergarten: parseInt(e.target.value) }))}>
                    <option value={0}>0</option><option value={15}>15</option><option value={30}>30</option><option value={50}>50</option>
                  </select>
                </div>
                <div className={styles.chipGroupWrap}>
                  <label className={styles.selectLabel}>Спорт</label>
                  <div className={styles.chipGroup}>
                    {SPORTS_OPTIONS.map((o) => (
                      <button key={o} type="button" className={`${styles.chip} ${form.sports.includes(o) ? styles.chipActive : ''}`} onClick={() => setForm((f) => ({ ...f, sports: toggleArr(f.sports, o) }))}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.findBtn} onClick={handleFind} disabled={loading}>
              <span>{loading ? '⏳' : '📍'}</span>
              {loading ? 'Поиск...' : 'Найти участок'}
            </button>

            {isSearched && (
              <button className={styles.findBtn} onClick={handleClear} style={{ background: '#6c757d', marginTop: '8px' }}>
                <span>🔄</span> Показать все участки
              </button>
            )}
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🗺</span>
              {isSearched ? 'ТОП-3 региона с площадками' : 'Все регионы и площадки'}
            </div>
            <div className={styles.cardBody}>
              <MapView
                topRegions={apiResults ? sortedRegions.slice(0, 3) : []}
                initialSites={apiResults ? apiResults.filteredSites : (allData?.sites || SITES)}
              />
              <div className={styles.tableWrap}>
                <table className={styles.regionsTable}>
                  <thead>
                    <tr><th>Регион</th><th>Рейтинг</th><th>Льготы</th><th>Тариф</th><th>Сталь</th><th>Утеплитель</th><th>Зарплата</th><th>Колледжи</th><th>Аренда</th><th>Детсады</th><th>Экокласс</th><th>Спрос</th></tr>
                  </thead>
                  <tbody>
                    {(isSearched ? sortedRegions?.slice(0, 3) : sortedRegions)?.map((r, i) => (
                      <tr key={r.id} className={i === 0 ? styles.topRow : ''}>
                        <td><strong>{r.name}</strong></td>
                        <td><span className={styles.ratingPill}>{r.rating}</span></td>
                        <td>{r.tax_incentives ? '✅' : '❌'}</td>
                        <td>{r.electricity_tariff} ₽</td>
                        <td>{r.steel_dist} км</td>
                        <td>{r.insulation_dist} км</td>
                        <td>{r.economy.avg_salary.toLocaleString('ru-RU')} ₽</td>
                        <td>{r.social.colleges}</td>
                        <td>{r.social.rent_1room.toLocaleString('ru-RU')} ₽</td>
                        <td>{r.social.kindergarten_load}</td>
                        <td>{r.economy.ecology_class}</td>
                        <td>{r.demand_score.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🖼</span> Концепт-борд
              <div className={styles.regionTabs}>
                {(isSearched ? sortedRegions.slice(0, 3) : sortedRegions).map((r, i) => (
                  <button key={r.id} className={`${styles.regionTab} ${activeRegionIdx === i ? styles.regionTabActive : ''}`} onClick={() => setActiveRegionIdx(i)}>{r.name}</button>
                ))}
              </div>
            </div>
            <div className={styles.cardBody}>
              {activeRegion?.cultural ? (
                <ConceptBoard region={activeRegion} priority={form.archPriority} />
              ) : (
                <div className={styles.cardBody}>Загрузка данных региона...</div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📋</span> Аналитическая справка
              <span className={styles.regionBadge}>
                {activeRegion?.name ?? 'Регион'} · {siteForAnalytics?.name ?? 'Площадка не выбрана'}
              </span>
              <PresentationButton
                region={activeRegion}
                site={siteForAnalytics}
                formData={form}
              />
            </div>
            <div className={styles.cardBody}>
              <Analytics region={activeRegion as any} site={siteForAnalytics as any} form={form} />
            </div>
          </div>

          {error && <div className={styles.errorBanner} style={{ background: '#dc3545', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', color: 'white' }}>❌ Ошибка: {error}</div>}
          {isSearched && !error && <div className={styles.successBanner}>✅ Анализ обновлён. Производительность: {form.volume} тыс. м²/год, сотрудников: {form.workers}, бюджет: {form.budget} млн ₽</div>}
          <div className={styles.footerNote}>Данные основаны на открытых источниках: Минстрой, Росстат, региональные энергокомиссии, реестр ОЭЗ</div>
        </main>
      </div>
    </div>
  );
}