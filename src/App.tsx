import React, { useState } from 'react';
import FormPanel from './components/FormPanel';
import MapPanel from './components/MapPanel';
import RankingTable from './components/RankingTable';
import ConceptBoard from './components/ConceptBoard';
import Analytics from './components/Analytics';
import { regions, sites } from './data/regions';
import type { FormState } from './types';
import './App.css';

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

function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [selectedRegionIdx, setSelectedRegionIdx] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedRegion = regions[selectedRegionIdx];
  const selectedSite = sites.find(s => s.region_id === selectedRegion.id) ?? sites[0];

  function handleChange(next: Partial<FormState>) {
    setForm(prev => ({ ...prev, ...next }));
  }

  function handleFind() {
    setHasSearched(true);
  }

  return (
    <div className="app">
      <FormPanel form={form} onChange={handleChange} onFind={handleFind} />

      <main className="app__main">
        <header className="app__header">
          <h1 className="app__title">
            <span className="app__title-icon">⬡</span>
            Наследие индустрии
          </h1>
          <p className="app__subtitle">
            Умный подбор локации и дизайна для производства сэндвич-панелей с местным характером
          </p>
        </header>

        {!hasSearched && (
          <div className="app__empty">
            <div className="app__empty-icon">⌖</div>
            <p>Настройте параметры слева и нажмите <strong>«Найти участок»</strong></p>
            <p className="app__empty-sub">Система подберёт ТОП-3 региона и рассчитает аналитику</p>
          </div>
        )}

        {hasSearched && (
          <div className="app__results">
            <MapPanel regions={regions} sites={sites} />
            <RankingTable
              regions={regions}
              sites={sites}
              selectedRegionIdx={selectedRegionIdx}
              onSelect={setSelectedRegionIdx}
            />

            <div className="app__region-tabs">
              {regions.map((r, idx) => (
                <button
                  key={r.id}
                  className={`app__region-tab ${idx === selectedRegionIdx ? 'active' : ''}`}
                  onClick={() => setSelectedRegionIdx(idx)}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <ConceptBoard region={selectedRegion} archPriority={form.archPriority} />
            <Analytics region={selectedRegion} site={selectedSite} form={form} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
