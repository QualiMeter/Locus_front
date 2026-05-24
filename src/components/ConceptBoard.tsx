import React from 'react';
import type { Region, ArchPriority } from '../types';
import './ConceptBoard.css';

interface Props {
  region: Region;
  archPriority: ArchPriority;
}

function getPalette(region: Region, priority: ArchPriority): string[] {
  if (priority === 'authentic') return region.cultural.colors_authentic;
  if (priority === 'techno') return region.cultural.colors_techno;
  return region.cultural.colors_eco;
}

function getMaterials(region: Region, priority: ArchPriority): string[] {
  if (priority === 'techno') return ['Сталь', 'Стеклофибробетон', ...region.cultural.materials.slice(0, 2)];
  if (priority === 'eco') return ['Древесина', 'Камень', 'Эко-черепица'];
  return region.cultural.materials;
}

function getStyleDesc(region: Region, priority: ArchPriority): string {
  if (priority === 'authentic') return `Аутентичность: интеграция в стили ${region.cultural.styles.join(', ')}`;
  if (priority === 'techno') return 'Техно-стиль: хай-тек, металл, минимализм';
  return 'Экодизайн: природные материалы, биофилия, живые стены';
}

const PRIORITY_LABELS: Record<ArchPriority, string> = {
  authentic: 'Аутентичность',
  techno: 'Техно-стиль',
  eco: 'Экодизайн',
};

const ConceptBoard: React.FC<Props> = ({ region, archPriority }) => {
  const palette = getPalette(region, archPriority);
  const materials = getMaterials(region, archPriority);
  const styleDesc = getStyleDesc(region, archPriority);

  return (
    <div className="concept-board">
      <div className="concept-board__header">
        <span className="concept-board__icon">◭</span>
        Концепт-борд
        <span className="concept-board__region">{region.name}</span>
      </div>

      <div className="concept-board__body">
        <div className="concept-board__priority-badge">{PRIORITY_LABELS[archPriority]}</div>

        <div className="concept-board__palette-section">
          <div className="concept-board__label">Цветовая палитра</div>
          <div className="concept-board__palette">
            {palette.map((color, i) => (
              <div key={i} className="concept-board__swatch-wrap">
                <div className="concept-board__swatch" style={{ background: color }} />
                <span className="concept-board__hex">{color}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="concept-board__materials-section">
          <div className="concept-board__label">Материалы</div>
          <div className="concept-board__materials">
            {materials.map(m => (
              <span key={m} className="concept-board__material-tag">{m}</span>
            ))}
          </div>
        </div>

        <div className="concept-board__style-section">
          <div className="concept-board__label">Стиль</div>
          <p className="concept-board__style-text">{styleDesc}</p>
        </div>

        <div className="concept-board__references">
          <div className="concept-board__label">Архитектурные референсы</div>
          <div className="concept-board__ref-grid">
            {region.cultural.styles.map((s, i) => (
              <div key={i} className="concept-board__ref-card">
                <div className="concept-board__ref-placeholder" style={{ background: palette[i % palette.length] + '22' }}>
                  <span style={{ color: palette[i % palette.length] }}>◈</span>
                </div>
                <span className="concept-board__ref-label">{s}</span>
              </div>
            ))}
            <div className="concept-board__ref-card">
              <div className="concept-board__ref-placeholder" style={{ background: palette[0] + '22' }}>
                <span style={{ color: palette[0] }}>◉</span>
              </div>
              <span className="concept-board__ref-label">Локальный контекст</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptBoard;
