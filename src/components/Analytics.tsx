import React from 'react';
import { Region, Site, FormState } from '../data';
import { RegionDto, SiteDto } from '../api';
import styles from './Analytics.module.css';

interface Props {
  region: Region | RegionDto;
  site: Site | SiteDto;
  form: FormState;
}

const Badge: React.FC<{
  type: 'positive' | 'warning' | 'negative';
  children: React.ReactNode;
}> = ({ type, children }) => (
    <span className={`${styles.badge} ${styles[type]}`}>
    {children}
  </span>
);

const ProgressBar: React.FC<{
  value: number;
  color?: string;
}> = ({ value, color }) => (
    <div className={styles.trackBg}>
      <div
          className={styles.trackFill}
          style={{
            width: `${Math.min(
                100,
                Math.max(0, value),
            )}%`,
            background:
                color || 'var(--accent)',
          }}
      />
    </div>
);

const InfoItem: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
    <div className={styles.infoItem}>
      <div className={styles.infoLabel}>
        {label}
      </div>

      <div className={styles.infoValue}>
        {children}
      </div>
    </div>
);

const Section: React.FC<{
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>
        {icon}
      </span>

        <span>{title}</span>
      </div>

      <div className={styles.sectionBody}>
        {children}
      </div>
    </div>
);

export const Analytics: React.FC<Props> = ({
                                             region,
                                             site,
                                             form,
                                           }) => {
  const volume = Number(form.volume || 0);

  const workers = Number(
      form.workers || 0,
  );

  const budget = Number(form.budget || 0);

  const kindergarten = Number(
      form.kindergarten || 0,
  );

  const housing = Number(
      form.housing || 0,
  );

  const budgetRub = budget * 1e6;

  const requiredPower =
      300 + (volume / 1000) * 400;

  const connectionCost =
      Number(site.connection_rub_per_kw) *
      requiredPower;

  const totalLandConn =
      Number(site.cost_land) +
      connectionCost;

  const budgetOk =
      totalLandConn <= budgetRub;

  // ===== СМЕТА =====

  const workshopCost =
      volume * 0.4 * 35000;

  const roadsCost =
      workers * 0.5 * 25 * 5000;

  const kindergartenCost =
      kindergarten *
      (workers / 100) *
      15 *
      50000;

  const housingRate =
      form.housingType ===
      'dormitory'
          ? 70000
          : 90000;

  const housingCost =
      housing > 0
          ? workers *
          (housing / 100) *
          housingRate
          : 0;

  const medicalCost =
      workers > 50 ? 12000000 : 0;

  const diningCost =
      workers > 30 ? 18000000 : 0;

  const landscapingCost =
      form.amenities.length * 3500000;

  const sportCost =
      form.sports.length * 5000000;

  const smetaTotal =
      workshopCost +
      roadsCost +
      kindergartenCost +
      housingCost +
      medicalCost +
      diningCost +
      landscapingCost +
      sportCost;

  // ===== СПРОС =====

  const demandScore =
      site.demand_score ||
      region.demand_score;

  // ===== ДЕТСАД =====

  const kindergLoad = Number(
      region.social.kindergarten_load,
  );

  const kindergDesc =
      kindergLoad > 110
          ? 'Дефицит мест'
          : kindergLoad > 95
              ? 'Умеренная нагрузка'
              : 'Достаточно мест';

  const kindergFill = Math.min(
      100,
      (kindergLoad / 150) * 100,
  );

  // ===== ЭКОЛОГИЯ =====

  const ecologyText =
      [
        '',
        'Низкий',
        'Пониженный',
        'Умеренный',
        'Высокий',
        'Очень высокий',
      ][region.economy.ecology_class] ||
      '';

  const ecClass =
      region.economy.ecology_class;

  // ===== OPEX =====

  const annualEnergy =
      requiredPower *
      0.72 *
      24 *
      365 *
      region.electricity_tariff;

  const fot =
      region.economy.avg_salary *
      workers;

  const insuranceRate =
      region.economy.reduced_insurance
          ? 0.076
          : 0.3;

  const fotFull =
      fot + fot * insuranceRate;

  // ===== РЕКОМЕНДАЦИИ =====

  const recommendations: string[] =
      [];

  if (
      region.social.rent_1room >
      40000 &&
      housing === 0
  ) {
    recommendations.push(
        'Высокая аренда жилья — рекомендуется корпоративное жильё или общежитие.',
    );
  }

  if (
      region.social.kindergarten_load >
      110 &&
      kindergarten === 0
  ) {
    recommendations.push(
        'В регионе дефицит мест в детсадах — рекомендуется строительство корпоративного детского сада.',
    );
  }

  if (site.highway_km > 15) {
    recommendations.push(
        'Удалённость от магистралей требует организации корпоративного транспорта.',
    );
  }

  if (ecClass >= 4) {
    recommendations.push(
        'Необходимо предусмотреть пылегазоочистку не менее 95% эффективности.',
    );
  }

  if (
      region.social.colleges >= 20
  ) {
    recommendations.push(
        'Высокий кадровый потенциал — рекомендуется заключение договоров с колледжами.',
    );
  }

  const fmt = (n: number) =>
      n.toLocaleString('ru-RU');

  return (
      <div className={styles.container}>
        {/* SOCIAL */}
        <Section
            icon="👥"
            title="Социальный профиль"
        >
          <div className={styles.grid}>
            <InfoItem label="Индекс городской среды">
              {region.social.urban_index}{' '}
              / 360
            </InfoItem>

            <InfoItem label="Профильные колледжи">
              {region.social.colleges}
            </InfoItem>

            <InfoItem label="Аренда 1-комн.">
              {fmt(
                  region.social.rent_1room,
              )}{' '}
              ₽
            </InfoItem>

            <div className={styles.fullSpan}>
              <div
                  className={
                    styles.infoLabel
                  }
              >
                Обеспеченность
                детсадами
              </div>

              <div
                  className={
                    styles.infoValue
                  }
              >
                {kindergLoad} детей /
                100 мест —{' '}
                {kindergDesc}
              </div>

              <ProgressBar
                  value={kindergFill}
                  color="#bc4e2c"
              />
            </div>
          </div>
        </Section>

        {/* ECONOMY */}
        <Section
            icon="📊"
            title="Экономика и экология"
        >
          <div className={styles.grid}>
            <InfoItem label="Налоговые льготы">
              {region.tax_incentives ? (
                  <Badge type="positive">
                    ✅ Есть
                  </Badge>
              ) : (
                  <Badge type="warning">
                    ❌ Нет
                  </Badge>
              )}
            </InfoItem>

            <InfoItem label="Страховые взносы">
              {region.economy
                  .reduced_insurance ? (
                  <Badge type="positive">
                    7,6%
                  </Badge>
              ) : (
                  <Badge type="warning">
                    30%
                  </Badge>
              )}
            </InfoItem>

            <InfoItem label="Энерготариф">
              {
                region.electricity_tariff
              }{' '}
              ₽/кВт·ч
            </InfoItem>

            <InfoItem label="Средняя зарплата">
              {fmt(
                  region.economy
                      .avg_salary,
              )}{' '}
              ₽
            </InfoItem>

            <InfoItem label="Экокласс">
              <Badge
                  type={
                    ecClass <= 2
                        ? 'positive'
                        : ecClass === 3
                            ? 'warning'
                            : 'negative'
                  }
              >
                {ecClass} —{' '}
                {ecologyText}
              </Badge>
            </InfoItem>
          </div>
        </Section>

        {/* INFRA */}
        <Section
            icon="⚡"
            title="Инфраструктура"
        >
          <div className={styles.grid}>
            <InfoItem label="Газ">
              {site.gas ? (
                  <Badge type="positive">
                    ✅ Есть
                  </Badge>
              ) : (
                  <Badge type="negative">
                    ❌ Нет
                  </Badge>
              )}
            </InfoItem>

            <InfoItem label="Трасса">
              {site.highway_km} км
            </InfoItem>

            <InfoItem label="Мощность">
              {site.power_kva} кВА
            </InfoItem>

            <InfoItem label="Подключение">
              {fmt(connectionCost)} ₽
            </InfoItem>

            <div className={styles.fullSpan}>
              <InfoItem label="Участок + подключение">
                <>
                  {(
                      totalLandConn / 1e6
                  ).toFixed(1)}{' '}
                  млн ₽

                  {budgetOk ? (
                      <Badge type="positive">
                        В бюджете
                      </Badge>
                  ) : (
                      <Badge type="negative">
                        Превышение
                      </Badge>
                  )}
                </>
              </InfoItem>
            </div>
          </div>
        </Section>

        {/* LOGISTICS */}
        <Section
            icon="🚚"
            title="Логистика и сбыт"
        >
          <div className={styles.grid}>
            <div>
              <InfoItem label="Сталь">
                {
                  region.steel_dist
                }{' '}
                км
              </InfoItem>

              <ProgressBar
                  value={
                      100 -
                      region.steel_dist / 5
                  }
                  color="#5f9ea0"
              />
            </div>

            <div>
              <InfoItem label="Утеплитель">
                {
                  region.insulation_dist
                }{' '}
                км
              </InfoItem>

              <ProgressBar
                  value={
                      100 -
                      region.insulation_dist /
                      3
                  }
                  color="#5f9ea0"
              />
            </div>

            <div
                className={styles.fullSpan}
            >
              <div
                  className={
                    styles.demandBlock
                  }
              >
                <div
                    className={
                      styles.demandScore
                    }
                >
                  {(
                      demandScore * 100
                  ).toFixed(0)}
                  %
                </div>

                <div
                    className={
                      styles.demandLabel
                    }
                >
                  Интегральный спрос
                </div>

                <ProgressBar
                    value={
                        demandScore * 100
                    }
                />

                <p
                    className={
                      styles.demandSub
                    }
                >
                  Радиус сбыта 400 км
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* OPEX */}
        <Section
            icon="💸"
            title="Прогноз эксплуатационных расходов"
        >
          <div className={styles.grid}>
            <InfoItem label="Электроэнергия / год">
              {fmt(
                  Math.round(
                      annualEnergy,
                  ),
              )}{' '}
              ₽
            </InfoItem>

            <InfoItem label="ФОТ / месяц">
              {fmt(
                  Math.round(fotFull),
              )}{' '}
              ₽
            </InfoItem>

            <InfoItem label="Сотрудники">
              {workers} чел.
            </InfoItem>

            <InfoItem label="Ставка страховых">
              {insuranceRate * 100}%
            </InfoItem>
          </div>
        </Section>

        {/* LLM */}
        <Section
            icon="🤖"
            title="Аналитика и рекомендации от LLM"
        >
          <div className={styles.llmBlock}>
            <div className={styles.llmCard}>
              <h4>
                Инвестиционная
                привлекательность
              </h4>

              <p>
                Регион обладает{' '}
                {region.tax_incentives
                    ? 'высокой'
                    : 'средней'}{' '}
                инвестиционной
                привлекательностью
                благодаря
                {region.tax_incentives
                    ? ' наличию льгот'
                    : ' устойчивому спросу'}
                , энерготарифу{' '}
                {
                  region.electricity_tariff
                }{' '}
                ₽/кВт·ч и кадровой
                базе.
              </p>
            </div>

            <div className={styles.llmCard}>
              <h4>
                Кадровый прогноз
              </h4>

              <p>
                В регионе{' '}
                {
                  region.social
                      .colleges
                }{' '}
                профильных колледжей.
                Потенциал закрытия{' '}
                {workers} вакансий —
                около 2–4 месяцев
                активного найма.
              </p>
            </div>

            <div className={styles.llmCard}>
              <h4>
                Экология
              </h4>

              <p>
                Экологический класс —{' '}
                {ecClass}.{' '}
                {ecClass >= 4
                    ? 'Рекомендуется современная система очистки.'
                    : 'Экологические риски умеренные.'}
              </p>
            </div>

            <div className={styles.llmCard}>
              <h4>
                Логистика
              </h4>

              <p>
                Расстояние до
                поставщика стали —{' '}
                {
                  region.steel_dist
                }{' '}
                км. Интегральный
                спрос —{' '}
                {demandScore.toFixed(
                    2,
                )}
                .
              </p>
            </div>

            {recommendations.map(
                (r, i) => (
                    <div
                        key={i}
                        className={
                          styles.llmAdvice
                        }
                    >
                      {r}
                    </div>
                ),
            )}
          </div>
        </Section>

        {/* SMETA */}
        <Section
            icon="🧮"
            title="Укрупнённая смета строительства"
        >
          <table
              className={styles.smetaTable}
          >
            <tbody>
            <tr>
              <td>Цех + склад</td>

              <td>
                {fmt(
                    Math.round(
                        workshopCost /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>
                Дороги + АБК
              </td>

              <td>
                {fmt(
                    Math.round(
                        roadsCost / 1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>Медпункт</td>

              <td>
                {fmt(
                    Math.round(
                        medicalCost /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>Столовая</td>

              <td>
                {fmt(
                    Math.round(
                        diningCost / 1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>
                Детский сад
              </td>

              <td>
                {fmt(
                    Math.round(
                        kindergartenCost /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>
                Жильё (
                {form.housingType ===
                'dormitory'
                    ? 'общежитие'
                    : 'квартиры'}
                )
              </td>

              <td>
                {fmt(
                    Math.round(
                        housingCost /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>
                Благоустройство
              </td>

              <td>
                {fmt(
                    Math.round(
                        landscapingCost /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>

            <tr>
              <td>
                Спортивная
                инфраструктура
              </td>

              <td>
                {fmt(
                    Math.round(
                        sportCost / 1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>
            </tbody>

            <tfoot>
            <tr
                className={
                  styles.smetaTotal
                }
            >
              <td>ИТОГО</td>

              <td>
                {fmt(
                    Math.round(
                        smetaTotal /
                        1e6,
                    ),
                )}{' '}
                млн ₽
              </td>
            </tr>
            </tfoot>
          </table>
        </Section>
      </div>
  );
};