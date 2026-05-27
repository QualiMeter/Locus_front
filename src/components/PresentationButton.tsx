import React, { useState } from 'react';
import { presentationService } from '../services/presentationService';

interface Props {
  region: any;
  site: any;
  formData: any;
  renders?: string[];
}

export const PresentationButton: React.FC<Props> = ({ region, site, formData, renders }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const pptx = await presentationService.generateAdminPresentation(region, site, formData, renders);
      presentationService.downloadPresentation(pptx, region.name);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Ошибка при генерации презентации');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      style={{
        padding: '10px 20px',
        background: isGenerating ? '#94a3b8' : 'linear-gradient(135deg, #4da3ff 0%, #236bff 100%)',
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
      }}
    >
      <span>{isGenerating ? '⏳' : '📊'}</span>
      <span>{isGenerating ? 'Генерация...' : 'Скачать презентацию (PPTX)'}</span>
    </button>
  );
};