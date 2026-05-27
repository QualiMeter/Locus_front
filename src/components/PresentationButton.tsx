import React, { useState } from 'react';
import { presentationService } from '../services/presentationService';

interface Props {
  region: any;
  site: any;
  formData: any;
  onGenerationStart?: () => void;
  onGenerationEnd?: () => void;
}

export const PresentationButton: React.FC<Props> = ({ 
  region, 
  site,
  formData, 
  onGenerationStart, 
  onGenerationEnd 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    onGenerationStart?.();

    try {
      const presentation = await presentationService.generatePresentation(region, site, formData);
      presentationService.downloadPresentation(presentation, region.name);
    } catch (error) {
      console.error('Error generating presentation:', error);
      alert('❌ Ошибка при генерации презентации. Попробуйте позже.');
    } finally {
      setIsGenerating(false);
      onGenerationEnd?.();
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      style={{
        padding: '10px 20px',
        marginLeft: 'auto',
        background: isGenerating 
          ? '#94a3b8' 
          : 'linear-gradient(135deg, #4da3ff 0%, #236bff 100%)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        cursor: isGenerating ? 'not-allowed' : 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        boxShadow: isGenerating ? 'none' : '0 4px 12px rgba(77,163,255,0.3)',
      }}
      onMouseEnter={(e) => {
        if (!isGenerating) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>
        {isGenerating ? '⏳' : '📊'}
      </span>
      <span>{isGenerating ? 'Генерация...' : 'Скачать презентацию'}</span>
    </button>
  );
};