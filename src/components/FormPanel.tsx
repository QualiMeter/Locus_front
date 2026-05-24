import React from 'react';
import type { FormState, ArchPriority } from '../types';
import './FormPanel.css';

interface Props {
  form: FormState;
  onChange: (next: Partial<FormState>) => void;
  onFind: () => void;
}

const AMENITIES = ['Аллея', 'Сквер с фонтаном', 'Беседки', 'Сцена', 'Тропа здоровья'];
const SPORTS = ['Уличные тренажёры', 'Стадион', 'Бассейн', 'Спортзал'];

function toggleMulti(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter(v => v !== value) : [...current, value];
}

const FormPanel: React.FC<Props> = ({ form, onChange, onFind }) => {
  return (
    <aside className="form-panel">
      <div className="form-panel__logo">
        <span className="form-panel__logo-icon">⬡</span>
        <span>Наследие<br /><strong>индустрии</strong></span>
      </div>

      <section className="form-section">
        <h3 className="form-section__title"><span className="form-section__icon">◈</span> Производство</h3>

        <div className="form-group">
          <label>Объём выпуска <em>{form.volume} тыс. м²/год</em></label>
          <input type="range" min={100} max={1000} step={10} value={form.volume}
            onChange={e => onChange({ volume: +e.target.value })} />
          <div className="range-labels"><span>100</span><span>1000</span></div>
        </div>

        <div className="form-group">
          <label>Сотрудники <em>{form.workers}</em></label>
          <input type="range" min={10} max={200} step={5} value={form.workers}
            onChange={e => onChange({ workers: +e.target.value })} />
          <div className="range-labels"><span>10</span><span>200</span></div>
        </div>

        <div className="form-group">
          <label>Бюджет участок + подкл. <em>{form.budget} млн ₽</em></label>
          <input type="range" min={10} max={300} step={5} value={form.budget}
            onChange={e => onChange({ budget: +e.target.value })} />
          <div className="range-labels"><span>10</span><span>300</span></div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="form-section__title"><span className="form-section__icon">◉</span> Логистика</h3>

        <div className="form-group">
          <label>Ж/д ветка</label>
          <div className="toggle-group">
            <button className={`toggle-btn ${!form.railway ? 'active' : ''}`} onClick={() => onChange({ railway: false })}>Нет</button>
            <button className={`toggle-btn ${form.railway ? 'active' : ''}`} onClick={() => onChange({ railway: true })}>Да</button>
          </div>
        </div>

        <div className="form-group">
          <label>Макс. расстояние до трассы <em>{form.highwayDist} км</em></label>
          <input type="range" min={1} max={100} value={form.highwayDist}
            onChange={e => onChange({ highwayDist: +e.target.value })} />
          <div className="range-labels"><span>1</span><span>100</span></div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="form-section__title"><span className="form-section__icon">◭</span> Архитектура</h3>

        <div className="form-group">
          <label>Архитектурный приоритет</label>
          <div className="arch-group">
            {(['authentic', 'techno', 'eco'] as ArchPriority[]).map(p => (
              <button key={p} className={`arch-btn ${form.archPriority === p ? 'active' : ''}`}
                onClick={() => onChange({ archPriority: p })}>
                {p === 'authentic' ? 'Аутентичность' : p === 'techno' ? 'Техно' : 'Экодизайн'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Благоустройство</label>
          <div className="chip-group">
            {AMENITIES.map(a => (
              <button key={a}
                className={`chip ${form.amenities.includes(a) ? 'chip--active' : ''}`}
                onClick={() => onChange({ amenities: toggleMulti(form.amenities, a) })}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="form-section__title"><span className="form-section__icon">◎</span> Социальные приоритеты</h3>

        <div className="form-group">
          <label>Обеспечение жильём</label>
          <select value={form.housing} onChange={e => onChange({ housing: +e.target.value })}>
            <option value={0}>0%</option>
            <option value={30}>30% (общежитие)</option>
            <option value={50}>50% (квартиры)</option>
            <option value={70}>70% (квартиры)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Детский сад (мест на 100 сотрудников)</label>
          <select value={form.kindergarten} onChange={e => onChange({ kindergarten: +e.target.value })}>
            <option value={0}>0</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="form-group">
          <label>Спорт</label>
          <div className="chip-group">
            {SPORTS.map(s => (
              <button key={s}
                className={`chip ${form.sports.includes(s) ? 'chip--active' : ''}`}
                onClick={() => onChange({ sports: toggleMulti(form.sports, s) })}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button className="find-btn" onClick={onFind}>
        <span className="find-btn__icon">⌖</span>
        Найти участок
      </button>

      <p className="form-panel__note">Данные: Минстрой, Росстат, реестр ОЭЗ</p>
    </aside>
  );
};

export default FormPanel;
