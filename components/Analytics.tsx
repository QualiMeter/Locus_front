import React from 'react';
import { Region, Site, FormState } from '../data';
import styles from './Analytics.module.css';

interface Props {
  region: Region;
  site: Site;
  form: FormState;
}

const Badge: React.FC<{ type: 'positive' | 'warning' | 'negative'; children: React.ReactNode }> = ({ type, children }) => (
  <span className={`${styles.badge} ${styles[type]}`}>{children}</span>
);

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color }) => (
  <div className={styles.trackBg}>
    <div className={styles.trackFill} style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color || 'var(--accent)' }} />
  </div>
);

const InfoItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{children}</div>
  </div>
);

const Section: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>{icon}</span>
      <span>{title}</span>
    </div>
    <div className={styles.sectionBody}>{children}</div>
  </div>
);

export const Analytics: React.FC<Props> = ({ region, site, form }) => {
  const { volume, workers, budget, kindergarten, housing } = form;
  const budgetRub = budget * 1e6;

  const requiredPower = 300 + (volume / 1000) * 400;
  const connectionCost = (site.connection_rub_per_kw || 4500) * requiredPower;
  const totalLandConn = (site.cost_land || 0) + connectionCost;
  const budgetOk = totalLandConn <= budgetRub;

  const smetaBase =
    (volume * 0.4 * 35000) +
    (workers * 0.5 * 25 * 5000) +
    (kindergarten * (workers / 100) * 15 * 50000);
  const smetaTotal = smetaBase + (housing > 0 ? workers * (housing / 100) * 70000 : 0);

  const demandScore = Math.min(0.95, 0.78 + (region.rating - 70) / 100);

  const kindergLoad = region.social.kindergarten_load;
  const kindergDesc = kindergLoad > 110 ? 'Дефицит мест' : kindergLoad > 90 ? 'Умеренная нагрузка' : 'Достаточно мест';
  const kindergFill = Math.min(100, (kindergLoad / 150) * 100);

  const ecologyText = ['', 'Низкий (очень благоприятно)', 'Пониженный (благоприятно)', 'Умеренный (средние риски)', 'Высокий (требуются очистные)', 'Очень высокий'][region.economy.ecology_class] || '';
  const ecClass = region.economy.ecology_class;

  const recs: string[] = [];
  if (site.highway_km > 15) recs.push('🚌 Корпоративный автобус (площадка >15 км от трассы)');
  if (region.social.kindergarten_load > 100 && kindergarten === 0) recs.push('🏗 Строительство детского сада (дефицит мест в регионе)');
  if (region.economy.reduced_insurance) recs.push('💰 Используйте сниженные страховые взносы 7,6% для экономии ФОТ');
  if (housing === 0 && region.social.rent_1room > 35000) recs.push('🏠 Рассмотрите программу обеспечения жильём (высокая аренда)');
  if (ecClass >= 4) recs.push('🌿 Предусмотреть современные очистные сооружения');

  const fmt = (n: number) => n.toLocaleString('ru-RU');

  return (
    <div className={styles.container}>
      {/* Social */}
      <Section icon="👥" title="Социальный паспорт региона">
        <div className={styles.grid}>
          <InfoItem label="Индекс качества городской среды">{region.social.urban_index} / 360</InfoItem>
          <InfoItem label="Профильные колледжи">{region.social.colleges} заведений</InfoItem>
          <InfoItem label="Аренда 1-комн. квартиры">{fmt(region.social.rent_1room)} ₽/мес</InfoItem>
          <div className={styles.fullSpan}>
            <div className={styles.infoLabel}>Обеспеченность детсадами</div>
            <div className={styles.infoValue}>{kindergLoad} детей/100 мест — {kindergDesc}</div>
            <ProgressBar value={kindergFill} color="#bc4e2c" />
          </div>
        </div>
      </Section>

      {/* Economy */}
      <Section icon="📊" title="Экономика, налоги и экология">
        <div className={styles.grid}>
          <InfoItem label="Налоговые льготы (ОЭЗ/ТОР)">
            {region.tax_incentives
              ? <Badge type="positive">✅ Есть (+20% рейтинг)</Badge>
              : <Badge type="warning">❌ Нет льгот</Badge>}
          </InfoItem>
          <InfoItem label="Страховые взносы">
            {region.economy.reduced_insurance
              ? <Badge type="positive">7,6% вместо 30%</Badge>
              : <Badge type="warning">Стандарт 30%</Badge>}
          </InfoItem>
          <InfoItem label="Энерготариф для промышленности">{region.electricity_tariff} руб/кВт·ч</InfoItem>
          <InfoItem label="Средняя зарплата">{fmt(region.economy.avg_salary)} ₽/мес</InfoItem>
          <div className={styles.fullSpan}>
            <InfoItem label="Экологический класс (ИЗА)">
              <Badge type={ecClass <= 2 ? 'positive' : ecClass === 3 ? 'warning' : 'negative'}>
                Класс {ecClass} — {ecologyText}
              </Badge>
            </InfoItem>
          </div>
        </div>
      </Section>

      {/* Infrastructure */}
      <Section icon="⚡" title={`Сетевая инфраструктура — ${site.name}`}>
        <div className={styles.grid}>
          <InfoItem label="Магистральный газ">
            {site.gas ? <Badge type="positive">✅ Присутствует</Badge> : <Badge type="negative">❌ Отсутствует</Badge>}
          </InfoItem>
          <InfoItem label="Расстояние до трассы">{site.highway_km} км</InfoItem>
          <InfoItem label="Свободная мощность">
            {site.power_kva} кВА <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>(требуется ~{Math.round(requiredPower)} кВА)</span>
          </InfoItem>
          <InfoItem label="Техприсоединение">
            {fmt(site.connection_rub_per_kw)} руб/кВт → {(connectionCost / 1e6).toFixed(1)} млн ₽
          </InfoItem>
          <div className={styles.fullSpan}>
            <InfoItem label="Участок + подключение">
              <span>{(totalLandConn / 1e6).toFixed(1)} млн ₽ из {budget} млн ₽ — </span>
              {budgetOk ? <Badge type="positive">✅ В рамках бюджета</Badge> : <Badge type="negative">⚠️ Превышает бюджет</Badge>}
            </InfoItem>
          </div>
        </div>
      </Section>

      {/* Logistics */}
      <Section icon="🚚" title="Логистика сырья">
        <div className={styles.grid}>
          <div>
            <InfoItem label="Расстояние до стали">{region.steel_dist} км</InfoItem>
            <ProgressBar value={Math.max(10, 100 - region.steel_dist / 5)} color="#5f9ea0" />
          </div>
          <div>
            <InfoItem label="Расстояние до утеплителя">{region.insulation_dist} км</InfoItem>
            <ProgressBar value={Math.max(10, 100 - region.insulation_dist / 3)} color="#5f9ea0" />
          </div>
        </div>
      </Section>

      {/* Market + Staff — SIDE BY SIDE */}
      <div className={styles.splitRow}>
        <Section icon="📈" title="Рынок сбыта (р. 400 км)">
          <div className={styles.demandBlock}>
            <div className={styles.demandScore}>{(demandScore * 100).toFixed(0)}%</div>
            <div className={styles.demandLabel}>Интегральный коэффициент спроса</div>
            <ProgressBar value={demandScore * 100} />
            <p className={styles.demandSub}>Плотность строек, с/х объектов, промпроектов</p>
          </div>
        </Section>

        <Section icon="🤝" title="Удержание персонала">
          <div className={styles.recList}>
            {recs.length > 0
              ? recs.map((r, i) => <div key={i} className={styles.recItem}>{r}</div>)
              : <div className={styles.recItem}>✔ Условия благоприятные, доп. меры не нужны</div>
            }
            <div className={styles.recMeta}>
              <span>🏠 Жильё: {housing}% сотрудников</span>
              <span>🏫 Детсад: {Math.round(kindergarten * (workers / 100))} мест</span>
            </div>
          </div>
        </Section>
      </div>

      {/* Estimate */}
      <Section icon="🧮" title="Укрупнённая смета строительства">
        <table className={styles.smetaTable}>
          <tbody>
            <tr><td>Цех + склад</td><td>{fmt(Math.round(volume * 0.4 * 35000 / 1e6))} млн ₽</td></tr>
            <tr><td>Парковка, дороги, АБК</td><td>{fmt(Math.round((workers * 0.5 * 25 * 5000 + volume * 0.4 * 0.35 * 5000) / 1e6))} млн ₽</td></tr>
            <tr><td>Детский сад ({kindergarten} мест/100 сотр.)</td><td>{fmt(Math.round(kindergarten * (workers / 100) * 15 * 50000 / 1e6))} млн ₽</td></tr>
            <tr><td>Жильё ({housing}% сотрудников)</td><td>{fmt(Math.round((housing > 0 ? workers * (housing / 100) * 70000 : 0) / 1e6))} млн ₽</td></tr>
            <tr><td>Благоустройство (оценка)</td><td>~{Math.round((site.cost_land / 2000000) * 0.2)} млн ₽</td></tr>
          </tbody>
          <tfoot>
            <tr className={styles.smetaTotal}><td>ИТОГО</td><td>{fmt(Math.round(smetaTotal / 1e6))} млн ₽</td></tr>
          </tfoot>
        </table>
        <p className={styles.smetaNote}>* Норматив 2 000 руб/м² участка (ориентир)</p>
      </Section>
    </div>
  );
};
