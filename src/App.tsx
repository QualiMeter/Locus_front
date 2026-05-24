import  { useState, useMemo } from 'react';
import { REGIONS, SITES, FormState, ArchPriority } from './data';
import { NumericInput } from './components/NumericInput';
import { MapView } from './components/MapView';
import { ConceptBoard } from './components/ConceptBoard';
import { Analytics } from './components/Analytics';
import styles from './App.module.css';

const DEFAULT_FORM: FormState = {
  volume: 300,
  workers: 80,
  budget: 150,
  railway: false,
  highwayDist: 15,
  archPriority: 'authentic',
  amenities: [],
  housing: 0,
  kindergarten: 0,
  sports: [],
};

const AMENITIES_OPTIONS = ['Аллея', 'Сквер с фонтаном', 'Беседки', 'Сцена', 'Тропа здоровья'];
const SPORTS_OPTIONS = ['Уличные тренажёры', 'Стадион', 'Бассейн', 'Спортзал'];

function toggleArr(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [activeRegionIdx, setActiveRegionIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const sortedRegions = useMemo(
    () => [...REGIONS].sort((a, b) => b.rating - a.rating),
    [],
  );

  const handleFind = () => setSubmitted(true);

  const activeRegion = REGIONS[activeRegionIdx];
  const activeSite = SITES.find(s => s.region_id === activeRegion.id) || SITES[0];

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>L</span>
          <span className={styles.logoText}>LOCUS</span>
        </div>
        <div className={styles.headerSub}>Умный подбор локации для производства сэндвич-панелей</div>
      </header>

      <div className={styles.layout}>
        {/* ---- LEFT PANEL ---- */}
        <aside className={styles.aside}>
          <div className={styles.asideInner}>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}>
                <span className={styles.formBlockIcon}>📦</span> Производство
              </div>
              <div className={styles.formFields}>
                <NumericInput label="Объём выпуска" value={form.volume} min={0} max={1000} step={0} unit="тыс. м²/год" onChange={v => setForm(f => ({ ...f, volume: v }))} />
                <NumericInput label="Сотрудники" value={form.workers} min={0} max={200} step={0} unit="чел." onChange={v => setForm(f => ({ ...f, workers: v }))} />
                <NumericInput label="Бюджет (участок+подкл)" value={form.budget} min={0} max={300} step={0} unit="млн ₽" onChange={v => setForm(f => ({ ...f, budget: v }))} />
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}>
                <span className={styles.formBlockIcon}>🚚</span> Логистика
              </div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>ЖД ветка</label>
                  <select className={styles.select} value={form.railway ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, railway: e.target.value === 'true' }))}>
                    <option value="false">Не требуется</option>
                    <option value="true">Требуется</option>
                  </select>
                </div>
                <NumericInput label="Макс. расст. до трассы" value={form.highwayDist} min={1} max={100} step={1} unit="км" onChange={v => setForm(f => ({ ...f, highwayDist: v }))} />
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}>
                <span className={styles.formBlockIcon}>🎨</span> Архитектура
              </div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Архитектурный приоритет</label>
                  <select className={styles.select} value={form.archPriority} onChange={e => setForm(f => ({ ...f, archPriority: e.target.value as ArchPriority }))}>
                    <option value="authentic">Аутентичность региону</option>
                    <option value="techno">Техно-стиль</option>
                    <option value="eco">Экодизайн</option>
                  </select>
                </div>
                <div className={styles.chipGroupWrap}>
                  <label className={styles.selectLabel}>Благоустройство</label>
                  <div className={styles.chipGroup}>
                    {AMENITIES_OPTIONS.map(o => (
                      <button key={o} type="button"
                        className={`${styles.chip} ${form.amenities.includes(o) ? styles.chipActive : ''}`}
                        onClick={() => setForm(f => ({ ...f, amenities: toggleArr(f.amenities, o) }))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formBlock}>
              <div className={styles.formBlockTitle}>
                <span className={styles.formBlockIcon}>🤝</span> Социальные приоритеты
              </div>
              <div className={styles.formFields}>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Обеспечение жильём</label>
                  <select className={styles.select} value={form.housing} onChange={e => setForm(f => ({ ...f, housing: parseInt(e.target.value) }))}>
                    <option value={0}>0%</option>
                    <option value={30}>30% (общежитие)</option>
                    <option value={50}>50% (квартиры)</option>
                    <option value={70}>70% (квартиры)</option>
                  </select>
                </div>
                <div className={styles.selectWrap}>
                  <label className={styles.selectLabel}>Детский сад (мест/100 сотр.)</label>
                  <select className={styles.select} value={form.kindergarten} onChange={e => setForm(f => ({ ...f, kindergarten: parseInt(e.target.value) }))}>
                    <option value={0}>0</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className={styles.chipGroupWrap}>
                  <label className={styles.selectLabel}>Спорт</label>
                  <div className={styles.chipGroup}>
                    {SPORTS_OPTIONS.map(o => (
                      <button key={o} type="button"
                        className={`${styles.chip} ${form.sports.includes(o) ? styles.chipActive : ''}`}
                        onClick={() => setForm(f => ({ ...f, sports: toggleArr(f.sports, o) }))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.findBtn} onClick={handleFind}>
              <span>📍</span>
              Найти участок
            </button>
          </div>
        </aside>

        {/* ---- RIGHT PANEL ---- */}
        <main className={styles.main}>

          {/* Map + Ranking */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🗺</span>
              ТОП-3 региона с площадками
            </div>
            <div className={styles.cardBody}>
              <MapView topRegions={sortedRegions.slice(0, 3)} />
              <div className={styles.tableWrap}>
                <table className={styles.rankTable}>
                  <thead>
                    <tr>
                      <th>Регион</th>
                      <th>Рейтинг</th>
                      <th>Льготы ОЭЗ</th>
                      <th>Тариф ₽/кВт·ч</th>
                      <th>Сталь</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRegions.slice(0, 3).map((r, i) => (
                      <tr key={r.id} className={i === 0 ? styles.topRow : ''}>
                        <td><strong>{r.name}</strong></td>
                        <td>
                          <span className={styles.ratingPill}>{r.rating}</span>
                        </td>
                        <td>{r.tax_incentives ? '✅ Да' : '❌ Нет'}</td>
                        <td>{r.electricity_tariff}</td>
                        <td>{r.steel_dist} км</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Concept Board */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🖼</span>
              Концепт-борд
              <div className={styles.regionTabs}>
                {REGIONS.map((r, i) => (
                  <button key={r.id}
                    className={`${styles.regionTab} ${activeRegionIdx === i ? styles.regionTabActive : ''}`}
                    onClick={() => setActiveRegionIdx(i)}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.cardBody}>
              <ConceptBoard region={activeRegion} priority={form.archPriority} />
            </div>
          </div>

          {/* Analytics */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📋</span>
              Аналитическая справка
              <span className={styles.regionBadge}>{activeRegion.name} · {activeSite.name}</span>
            </div>
            <div className={styles.cardBody}>
              <Analytics region={activeRegion} site={activeSite} form={form} />
            </div>
          </div>

          {submitted && (
            <div className={styles.successBanner}>
              ✅ Анализ обновлён. Параметры: {form.volume} тыс. м²/год, {form.workers} сотрудников, бюджет {form.budget} млн ₽
            </div>
          )}

          <div className={styles.footerNote}>
            Данные основаны на открытых источниках: Минстрой, Росстат, региональные энергокомиссии, реестр ОЭЗ
          </div>
        </main>
      </div>
    </div>
  );
}
