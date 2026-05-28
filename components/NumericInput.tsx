import React, { useCallback, useRef } from 'react';
import styles from './NumericInput.module.css';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const NumericInput: React.FC<Props> = ({ label, value, min, max, step, unit, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? step : -step;
    onChange(clamp(Math.round((value + delta) / step) * step));
  }, [value, step, min, max, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (!isNaN(raw)) onChange(clamp(raw));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) onChange(value);
    else onChange(clamp(raw));
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <div className={styles.inputWrap}>
          <input
            ref={inputRef}
            className={styles.numInput}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            onBlur={handleBlur}
            onWheel={handleWheel}
          />
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.minmax}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
