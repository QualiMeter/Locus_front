import React, { useState, useEffect } from 'react';
import { openRouterService, LLMAnalytics } from '../services/openRouterService';

interface Props {
  region: any;
  site: any;
  formData: any;
  topRegions?: any[];
}

export const LLMAnalyticsBlock: React.FC<Props> = ({ region, site, formData, topRegions }) => {
  const [analytics, setAnalytics] = useState<LLMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        // Реальный вызов Gemini API
        const result = await openRouterService.generateAnalytics(region, site, formData, topRegions);
        setAnalytics(result);
      } catch (err) {
        console.error('Gemini error:', err);
        setError('Не удалось загрузить аналитику');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [region, site, formData, topRegions]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <span style={{ fontSize: '24px' }}>🤖</span>
        <p>Аналитика от Gemini загружается...</p>
        <p style={{ fontSize: '12px', color: '#888' }}>(первый запрос может занять 3-5 секунд)</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
        <p>⚠️ Ошибка загрузки аналитики</p>
        <p style={{ fontSize: '12px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Инвестиционная привлекательность */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          📈 1. Оценка инвестиционной привлекательности
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {analytics.investmentVerdict}
        </div>
      </div>

      {/* 2. Рекомендации по снижению рисков */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          ⚠️ 2. Рекомендации по снижению рисков
        </div>
        <div style={{ padding: '16px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {analytics.riskRecommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Кадровый прогноз */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          👥 3. Кадровый прогноз и стратегия подбора
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem' }}>
          {analytics.hrForecast}
        </div>
      </div>

      {/* 4. Экологическая рекомендация */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          🌿 4. Экологическая рекомендация
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem' }}>
          {analytics.ecologyRecommendation}
        </div>
      </div>

      {/* 5. Логистическая оптимизация */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          🚚 5. Логистическая оптимизация
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem' }}>
          {analytics.logisticsOptimization}
        </div>
      </div>

      {/* 6. Прогноз эксплуатационных расходов (OPEX) */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          💸 6. Прогноз эксплуатационных расходов (OPEX)
        </div>
        <div style={{ padding: '16px' }}>
          <p><strong>Электроэнергия:</strong> {analytics.opexForecast.energy}</p>
          <p style={{ marginTop: '12px' }}><strong>ФОТ:</strong> {analytics.opexForecast.payroll}</p>
        </div>
      </div>

      {/* 7. Сравнение с другими регионами */}
      <div style={{ background: 'var(--card-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          📊 7. Сравнение с другими регионами
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem' }}>
          {analytics.benchmarking}
        </div>
      </div>

      {/* 8. Для презентации администрации */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(77,163,255,0.08) 0%, rgba(35,107,255,0.04) 100%)', 
        border: '1px solid var(--accent)', 
        borderRadius: '12px', 
        overflow: 'hidden' 
      }}>
        <div style={{ padding: '12px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}>
          🎯 8. Для презентации администрации (слайд 6)
        </div>
        <div style={{ padding: '16px', fontSize: '0.95rem' }}>
          {analytics.presentationReady}
        </div>
      </div>
    </div>
  );
};