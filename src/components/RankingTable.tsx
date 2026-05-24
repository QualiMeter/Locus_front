import React from 'react';
import type { Region, Site } from '../types';
import './RankingTable.css';

interface Props {
  regions: Region[];
  sites: Site[];
  selectedRegionIdx: number;
  onSelect: (idx: number) => void;
}

const RankingTable: React.FC<Props> = ({ regions, sites, selectedRegionIdx, onSelect }) => {
  const sorted = [...regions].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="ranking-table">
      <div className="ranking-table__header">
        <span className="ranking-table__icon">◈</span>
        Сравнение регионов
      </div>
      <div className="ranking-table__scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Регион</th>
              <th>Рейтинг</th>
              <th>Льготы ОЭЗ</th>
              <th>Тариф ₽/кВт·ч</th>
              <th>Сталь</th>
              <th>Площадка</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, idx) => {
              const site = sites.find(s => s.region_id === r.id);
              const regionIdx = regions.indexOf(r);
              const colors = ['#4a9eca', '#f0a04b', '#6dbea0'];
              const isSelected = regionIdx === selectedRegionIdx;

              return (
                <tr key={r.id}
                  className={`ranking-row ${isSelected ? 'ranking-row--active' : ''}`}
                  onClick={() => onSelect(regionIdx)}>
                  <td>
                    <span className="ranking-badge" style={{ background: colors[idx] }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="ranking-region">{r.name}</td>
                  <td>
                    <div className="rating-bar">
                      <div className="rating-bar__fill" style={{ width: `${r.rating}%`, background: colors[idx] }} />
                      <span>{r.rating}</span>
                    </div>
                  </td>
                  <td>{r.tax_incentives ? <span className="yes-tag">✓ Да</span> : <span className="no-tag">✗ Нет</span>}</td>
                  <td className="mono">{r.electricity_tariff}</td>
                  <td className="mono">{r.steel_dist} км</td>
                  <td className="site-name">{site?.name ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
