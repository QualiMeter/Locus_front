import React from 'react';
import type { Region, Site, FormState, EcologyClass } from '../types';
import './Analytics.css';

interface Props {
  region: Region;
  site: Site;
  form: FormState;
}

function ecologyLabel(cls: EcologyClass): string {
  const map: Record<EcologyClass, string> = {
    1: 'Низкий уровень загрязнения',
    2: 'Пониженный уровень загрязнения',
    3: 'Умеренный уровень загрязнения',
    4: 'Высокий уровень загрязнения',
    5: 'Очень высокий уровень загрязнения',
  };
  return map[cls];
}

function ecologyBadgeClass(cls: EcologyClass): string {
  if (cls <= 2) return 'badge--positive';
  if (cls === 3) return 'badge--warning';
  return 'badge--negative';
}

interface AnalyticsBlock {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const Analytics: React.FC<Props> = ({ region, site, form }) => {
  const requiredPower = 300 + (form.volume / 1000) * 400;
  const connectionCost = site.connection_rub_per_kw * requiredPower;
  const totalLandConn = site.cost_land + connectionCost;
  const budgetOk = totalLandConn <= form.budget * 1e6;

  const smetaBase =
    form.volume * 0.4 * 35000 +
    form.workers * 0.5 * 25 * 5000 +
    form.kindergarten * (form.workers / 100) * 15 * 50000;
  const smetaTotal =
    smetaBase + (form.housing > 0 ? form.workers * (form.housing / 100) * 70000 : 0);

  const demandScore = Math.min(0.95, 0.78 + (region.rating - 70) / 100);
  const kindergLoad = region.social.kindergarten_load;
  const kindergFill = Math.min(100, (kindergLoad / 150) * 100);
  const kindergDesc = kindergLoad > 110 ? 'Дефицит мест' : kindergLoad > 90 ? 'Умеренная нагрузка' : 'Достаточно мест';

  const recommendations: string[] = [];
  if (site.highway_km > 15) recommendations.push('🚌 Корпоративный автобус (удалённость >15 км)');
  if (region.social.kindergarten_load > 100 && form.kindergarten === 0) recommendations.push('🏗️ Строительство собственного детского сада (дефицит в регионе)');
  if (region.economy.reduced_insurance) recommendations.push('💰 Сниженные страховые взносы 7,6% вместо 30%');
  if (form.housing === 0 && region.social.rent_1room > 35000) recommendations.push('🏠 Программа обеспечения жильём (высокая аренда)');
  if (region.economy.ecology_class >= 4) recommendations.push('🌿 Современные очистные сооружения (высокий экологический класс)');

  const blocks: AnalyticsBlock[] = [
    {
      title: 'Социальный паспорт региона',
      icon: '◎',
      content: (
        <div className="analytics__grid">
          <div className="analytics__item">
            <div className="analytics__item-label">Индекс городской среды</div>
            <div className="analytics__item-value">{region.social.urban_index} <span className="analytics__item-sub">/ 360</span></div>
            <div className="analytics__bar-bg">
              <div className="analytics__bar-fill" style={{ width: `${(region.social.urban_index / 360) * 100}%` }} />
            </div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Обеспеченность детсадами</div>
            <div className="analytics__item-value">{kindergLoad} <span className="analytics__item-sub">детей/100 мест</span></div>
            <div className="analytics__bar-bg">
              <div className="analytics__bar-fill" style={{ width: `${kindergFill}%`, background: kindergLoad > 100 ? '#d0806a' : '#6dbea0' }} />
            </div>
            <div className="analytics__item-note">{kindergDesc}</div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Профильные колледжи</div>
            <div className="analytics__item-value">{region.social.colleges} <span className="analytics__item-sub">заведений</span></div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Аренда 1-комн. квартиры</div>
            <div className="analytics__item-value">{region.social.rent_1room.toLocaleString()} <span className="analytics__item-sub">₽/мес</span></div>
          </div>
        </div>
      ),
    },
    {
      title: 'Экономика, налоги и экология',
      icon: '◈',
      content: (
        <div className="analytics__grid">
          <div className="analytics__item">
            <div className="analytics__item-label">Налоговые льготы (ОЭЗ/ТОР)</div>
            <span className={`analytics__badge ${region.tax_incentives ? 'badge--positive' : 'badge--warning'}`}>
              {region.tax_incentives ? '✓ Есть (+20% рейтинг)' : '✗ Нет льгот'}
            </span>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Страховые взносы</div>
            <span className={`analytics__badge ${region.economy.reduced_insurance ? 'badge--positive' : 'badge--warning'}`}>
              {region.economy.reduced_insurance ? '7,6% вместо 30%' : 'Стандарт 30%'}
            </span>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Энерготариф</div>
            <div className="analytics__item-value">{region.electricity_tariff} <span className="analytics__item-sub">₽/кВт·ч</span></div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Средняя зарплата</div>
            <div className="analytics__item-value">{region.economy.avg_salary.toLocaleString()} <span className="analytics__item-sub">₽/мес</span></div>
          </div>
          <div className="analytics__item analytics__item--wide">
            <div className="analytics__item-label">Экологический класс (ИЗА)</div>
            <span className={`analytics__badge ${ecologyBadgeClass(region.economy.ecology_class)}`}>
              Класс {region.economy.ecology_class} — {ecologyLabel(region.economy.ecology_class)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: `Сетевая инфраструктура · ${site.name}`,
      icon: '⌁',
      content: (
        <div className="analytics__grid">
          <div className="analytics__item">
            <div className="analytics__item-label">Магистральный газ</div>
            <span className={`analytics__badge ${site.gas ? 'badge--positive' : 'badge--negative'}`}>
              {site.gas ? '✓ Присутствует' : '✗ Отсутствует'}
            </span>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Свободная мощность</div>
            <div className="analytics__item-value">{site.power_kva} <span className="analytics__item-sub">кВА</span></div>
            <div className="analytics__item-note">Требуется ~{Math.round(requiredPower)} кВА</div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">До трассы</div>
            <div className="analytics__item-value">{site.highway_km} <span className="analytics__item-sub">км</span></div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">Плата за техприсоединение</div>
            <div className="analytics__item-value">{site.connection_rub_per_kw} <span className="analytics__item-sub">₽/кВт</span></div>
            <div className="analytics__item-note">Итого: {(connectionCost / 1e6).toFixed(1)} млн ₽</div>
          </div>
          <div className="analytics__item analytics__item--wide">
            <div className="analytics__item-label">Бюджет участок + подключение</div>
            <div className="analytics__item-value">{(totalLandConn / 1e6).toFixed(1)} <span className="analytics__item-sub">из {form.budget} млн ₽</span></div>
            <span className={`analytics__badge ${budgetOk ? 'badge--positive' : 'badge--negative'}`}>
              {budgetOk ? '✓ В рамках бюджета' : '⚠ Превышает бюджет'}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Логистика сырья',
      icon: '◉',
      content: (
        <div className="analytics__grid">
          <div className="analytics__item">
            <div className="analytics__item-label">До поставщика стали</div>
            <div className="analytics__item-value">{region.steel_dist} <span className="analytics__item-sub">км</span></div>
            <div className="analytics__bar-bg">
              <div className="analytics__bar-fill" style={{ width: `${Math.max(10, 100 - region.steel_dist / 5)}%`, background: '#5f9ea0' }} />
            </div>
          </div>
          <div className="analytics__item">
            <div className="analytics__item-label">До поставщика утеплителя</div>
            <div className="analytics__item-value">{region.insulation_dist} <span className="analytics__item-sub">км</span></div>
            <div className="analytics__bar-bg">
              <div className="analytics__bar-fill" style={{ width: `${Math.max(10, 100 - region.insulation_dist / 3)}%`, background: '#5f9ea0' }} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Рынок сбыта (радиус 400 км)',
      icon: '◌',
      content: (
        <div className="analytics__grid">
          <div className="analytics__item analytics__item--wide">
            <div className="analytics__item-label">Интегральный коэффициент спроса</div>
            <div className="analytics__item-value">{(demandScore * 100).toFixed(0)}<span className="analytics__item-sub">%</span></div>
            <div className="analytics__bar-bg">
              <div className="analytics__bar-fill" style={{ width: `${demandScore * 100}%`, background: '#4a9eca' }} />
            </div>
            <div className="analytics__item-note">Плотность строек, с/х объектов и промпроектов в радиусе</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Рекомендации по удержанию персонала',
      icon: '◑',
      content: (
        <div className="analytics__rec-list">
          {recommendations.length > 0
            ? recommendations.map((r, i) => <div key={i} className="analytics__rec-item">{r}</div>)
            : <div className="analytics__rec-item analytics__rec-item--ok">✅ Дополнительные меры не требуются — условия в регионе благоприятны</div>
          }
          <div className="analytics__rec-meta">
            <span><strong>Жильё:</strong> {form.housing}% сотрудников</span>
            <span><strong>Детский сад:</strong> {form.kindergarten} мест/100 сотр ({Math.round(form.kindergarten * (form.workers / 100))} мест всего)</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Укрупнённая смета строительства',
      icon: '◫',
      content: (
        <div className="analytics__smeta">
          <table className="smeta-table">
            <tbody>
              <tr>
                <td>Цех + склад</td>
                <td className="smeta-table__val">{Math.round((form.volume * 0.4 * 35000) / 1e6)} млн ₽</td>
              </tr>
              <tr>
                <td>Парковка, дороги, АБК</td>
                <td className="smeta-table__val">{Math.round((form.workers * 0.5 * 25 * 5000) / 1e6)} млн ₽</td>
              </tr>
              <tr>
                <td>Детский сад ({form.kindergarten} мест/100 сотр)</td>
                <td className="smeta-table__val">{Math.round((form.kindergarten * (form.workers / 100) * 15 * 50000) / 1e6)} млн ₽</td>
              </tr>
              <tr>
                <td>Жильё ({form.housing}% сотрудников)</td>
                <td className="smeta-table__val">{Math.round((form.housing > 0 ? form.workers * (form.housing / 100) * 70000 : 0) / 1e6)} млн ₽</td>
              </tr>
              <tr>
                <td>Благоустройство (2 000 ₽/м²)</td>
                <td className="smeta-table__val">~{Math.round((site.cost_land / 2000000) * 0.2)} млн ₽*</td>
              </tr>
              <tr className="smeta-table__total">
                <td>ИТОГО строительство</td>
                <td className="smeta-table__val">{Math.round(smetaTotal / 1e6)} млн ₽</td>
              </tr>
            </tbody>
          </table>
          <p className="analytics__smeta-note">* Норматив 2 000 руб/м² участка (ориентир). По формулам раздела 6 ТЗ.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="analytics">
      {blocks.map((block, i) => (
        <div key={i} className="analytics__block">
          <div className="analytics__block-header">
            <span className="analytics__block-icon">{block.icon}</span>
            {block.title}
          </div>
          <div className="analytics__block-body">
            {block.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
