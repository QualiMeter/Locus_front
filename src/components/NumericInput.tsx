import React from 'react';
import styles from './NumericInput.module.css'; // Убедитесь, что стили подключены

interface Props {
  label: string;
  value: number | '';
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const NumericInput: React.FC<Props> = ({ label, value, min, max, step = 1, unit, onChange }) => {

  const handleChange = (val: string) => {
    // Если поле пустое, передаем 0 или обрабатываем как пустоту
    if (val === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <label className={styles.label}>{label}</label>
          <div className={styles.inputRow}>
            <input
                type="number"
                className={styles.numberInput}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
            {unit && <span className={styles.unit}>{unit}</span>}
          </div>
        </div>

        {/* Слайдер */}
        <input
            type="range"
            className={styles.slider}
            min={min}
            max={max}
            step={step}
            value={value || min}
            onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
  );
};