import React from 'react';

import {
  Region,
  ArchPriority,
} from '../data';

import { RegionDto } from '../api';

import styles from './ConceptBoard.module.css';

interface Props {
  region: Region | RegionDto;
  priority: ArchPriority;
}

const PRIORITY_LABELS: Record<
    ArchPriority,
    string
> = {
  authentic:
      'Аутентичность региону',

  techno: 'Техно-стиль',

  eco: 'Экодизайн',
};

const PRIORITY_DESC: Record<
    ArchPriority,
    (r: Region) => string
> = {
  authentic: (r) =>
      `Архитектурная интеграция в локальный контекст региона: ${r.cultural.styles.join(
          ', ',
      )}. Основная идея — подчеркнуть идентичность территории через материалы, цветовую палитру и общественные пространства.`,

  techno: () =>
      'Современная промышленная эстетика: металл, стекло, строгая геометрия, минимализм и выразительные инженерные конструкции.',

  eco: () =>
      'Биофильный дизайн с озеленением, натуральными материалами, светлыми фасадами и интеграцией природных сценариев.',
};

const HERO_IMAGES: Record<
    ArchPriority,
    string
> = {
  authentic:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1600&auto=format&fit=crop',

  techno:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',

  eco:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1600&auto=format&fit=crop',
};

export const ConceptBoard: React.FC<
    Props
> = ({ region, priority }) => {
  const palette =
      priority === 'authentic'
          ? region.cultural
              .colors_authentic
          : priority === 'techno'
              ? region.cultural.colors_techno
              : region.cultural.colors_eco;

  let materials = [
    ...region.cultural.materials,
  ];

  if (priority === 'techno') {
    materials = [
      'Сталь',
      'Алюминий',
      'Стекло',
      'Композитные панели',
    ];
  }

  if (priority === 'eco') {
    materials = [
      'Древесина',
      'Камень',
      'Эко-панели',
      'Озеленение',
    ];
  }

  return (
      <div className={styles.board}>
        {/* HERO */}
        <div
            className={styles.hero}
            style={{
              backgroundImage: `url(${HERO_IMAGES[priority]})`,
            }}
        >
          <div className={styles.heroOverlay}>
            <div
                className={styles.heroTop}
            >
              <div
                  className={
                    styles.priorityBadge
                  }
              >
                {
                  PRIORITY_LABELS[
                      priority
                      ]
                }
              </div>

              <div
                  className={
                    styles.regionBadge
                  }
              >
                {region.name}
              </div>
            </div>

            <div
                className={
                  styles.heroBottom
                }
            >
              <h2
                  className={
                    styles.heroTitle
                  }
              >
                Архитектурный
                концепт площадки
              </h2>

              <p
                  className={
                    styles.heroDesc
                  }
              >
                {
                  PRIORITY_DESC[
                      priority
                      ](region)
                }
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* COLORS */}
          <div className={styles.card}>
            <div
                className={
                  styles.cardLabel
                }
            >
              Цветовая палитра
            </div>

            <div
                className={
                  styles.paletteGrid
                }
            >
              {palette.map((color) => (
                  <div
                      key={color}
                      className={
                        styles.colorCard
                      }
                  >
                    <div
                        className={
                          styles.colorPreview
                        }
                        style={{
                          background:
                          color,
                        }}
                    />

                    <div
                        className={
                          styles.colorHex
                        }
                    >
                      {color}
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* STYLES */}
          <div className={styles.card}>
            <div
                className={
                  styles.cardLabel
                }
            >
              Архитектурные стили
            </div>

            <div
                className={
                  styles.stylesWrap
                }
            >
              {region.cultural.styles.map(
                  (style) => (
                      <div
                          key={style}
                          className={
                            styles.styleCard
                          }
                      >
                        {style}
                      </div>
                  ),
              )}
            </div>
          </div>

          {/* MATERIALS */}
          <div className={styles.card}>
            <div
                className={
                  styles.cardLabel
                }
            >
              Материалы
            </div>

            <div
                className={
                  styles.materialsWrap
                }
            >
              {materials.map((m) => (
                  <div
                      key={m}
                      className={
                        styles.materialTag
                      }
                  >
                    {m}
                  </div>
              ))}
            </div>
          </div>

          {/* REFERENCE */}
          <div
              className={`${styles.card} ${styles.referenceCard}`}
          >
            <div
                className={
                  styles.cardLabel
                }
            >
              Архитектурная
              рекомендация
            </div>

            <p
                className={
                  styles.referenceText
                }
            >
              Рекомендуется
              использование
              локальных
              материалов и
              формообразования,
              характерного для{' '}
              {
                region.cultural
                    .styles[0]
              }
              . Приоритет —
              создание узнаваемой
              промышленной
              архитектуры с
              интеграцией
              общественных
              пространств и
              благоустройства.
            </p>
          </div>
        </div>
      </div>
  );
};