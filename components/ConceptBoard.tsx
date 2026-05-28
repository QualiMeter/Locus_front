import React from 'react';
import { Region, ArchPriority } from '../data';
import styles from './ConceptBoard.module.css';

interface Props {
  region: Region;
  priority: ArchPriority;
}

const PRIORITY_LABELS: Record<ArchPriority, string> = {
  authentic: 'Аутентичность региону',
  techno: 'Техно-стиль',
  eco: 'Экодизайн',
};

const PRIORITY_DESC: Record<ArchPriority, (r: Region) => string> = {
  authentic: (r) => `Интеграция в ${r.cultural.styles.join(', ')} — сохранение духа места`,
  techno: () => 'Хай-тек, металл, строгий минимализм, промышленная эстетика',
  eco: () => 'Природные материалы, биофилия, зелёные кровли и вертикальное озеленение',
};

export const ConceptBoard: React.FC<Props> = ({ region, priority }) => {
  const palette = priority === 'authentic'
    ? region.cultural.colors_authentic
    : priority === 'techno'
    ? region.cultural.colors_techno
    : region.cultural.colors_eco;

  let materials = [...region.cultural.materials];
  if (priority === 'techno') materials = ['Сталь', 'Стеклофибробетон', ...materials.slice(0, 2)];
  if (priority === 'eco') materials = ['Древесина', 'Камень', 'Эко-черепица'];

  return (
    <div className={styles.board}>
      <div className={styles.paletteSide}>
        <div className={styles.paletteLabel}>Цветовая палитра</div>
        <div className={styles.swatches}>
          {palette.map(color => (
            <div key={color} className={styles.swatch} style={{ background: color }}>
              <span className={styles.swatchHex}>{color}</span>
            </div>
          ))}
        </div>
        <div className={styles.priorityTag}>{PRIORITY_LABELS[priority]}</div>
      </div>
      <div className={styles.infoSide}>
        <div className={styles.styleBlock}>
          <div className={styles.sectionLabel}>Архитектурные стили</div>
          <div className={styles.styleNames}>{region.cultural.styles.join(' · ')}</div>
        </div>
        <div className={styles.materialsBlock}>
          <div className={styles.sectionLabel}>Материалы</div>
          <div className={styles.materialTags}>
            {materials.map(m => <span key={m} className={styles.matTag}>{m}</span>)}
          </div>
        </div>
        <div className={styles.descBlock}>
          <div className={styles.sectionLabel}>Концепция</div>
          <p className={styles.descText}>{PRIORITY_DESC[priority](region)}</p>
        </div>
        <div className={styles.refBlock}>
          <div className={styles.sectionLabel}>Референсы</div>
          <p className={styles.refText}>{region.cultural.styles[0]} архитектура — характерные материалы и детали региона</p>
        </div>
      </div>
    </div>
  );
};
