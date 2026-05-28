import PptxGenJS from 'pptxgenjs';

class PresentationService {
  async generateAdminPresentation(
    regionData: any,
    siteData: any,
    formData: any,
    renders?: string[]
  ): Promise<any> {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.defineLayout({ name: 'WIDE', width: 10, height: 5.625 });
    
    const volume = Number(formData.volume || 0);
    const workers = Number(formData.workers || 0);
    const budget = Number(formData.budget || 0);
    const kindergarten = Number(formData.kindergarten || 0);
    const housing = Number(formData.housing || 0);
    const housingType = formData.housingType === 'dormitory' ? 'общежитие' : 'квартиры';
    
    const requiredPower = 300 + (volume / 1000) * 400;
    const workshopCost = volume * 0.4 * 35000;
    const roadsCost = workers * 0.5 * 25 * 5000;
    const kindergartenCost = kindergarten * (workers / 100) * 15 * 50000;
    const housingCost = housing > 0 ? workers * (housing / 100) * (formData.housingType === 'dormitory' ? 70000 : 90000) : 0;
    const medicalCost = workers > 50 ? 12000000 : 0;
    const diningCost = workers > 30 ? 18000000 : 0;
    const totalInvestment = (workshopCost + roadsCost + kindergartenCost + housingCost + medicalCost + diningCost) / 1e6;
    const annualTax = budget * 0.15;
    
    // СЛАЙД 1: ТИТУЛ
    const slide1 = pptx.addSlide();
    slide1.background = { fill: '1a1a2e' };
    slide1.addText('Инвестиционный проект', { x: 0, y: 1.0, w: '100%', h: 0.7, fontSize: 32, color: 'FFFFFF', align: 'center' });
    slide1.addText('Строительство завода сэндвич-панелей', { x: 0, y: 1.7, w: '100%', h: 0.6, fontSize: 24, color: 'CCCCCC', align: 'center' });
    slide1.addText(regionData.name, { x: 0, y: 2.5, w: '100%', h: 0.9, fontSize: 42, bold: true, color: '4DA3FF', align: 'center' });
    slide1.addText(`Площадка: ${siteData.name}`, { x: 0, y: 3.5, w: '100%', h: 0.5, fontSize: 20, color: 'CCCCCC', align: 'center' });
    slide1.addText(`📅 ${new Date().toLocaleDateString('ru-RU')}`, { x: 0, y: 5.0, w: '100%', h: 0.4, fontSize: 14, color: '888888', align: 'center' });
    
    // СЛАЙД 2: ПАРАМЕТРЫ ПРОЕКТА
    const slide2 = pptx.addSlide();
    slide2.addText('Параметры проекта', { x: 0, y: 0.2, w: '100%', h: 0.7, fontSize: 32, bold: true, color: '4DA3FF', align: 'center' });
    
    const params = [
      { label: 'Объём выпуска', value: `${volume} тыс. м²/год` },
      { label: 'Бюджет проекта', value: `${budget} млн ₽` },
      { label: 'Сотрудники', value: `${workers} чел.` },
      { label: 'Требуемая мощность', value: `${Math.round(requiredPower)} кВА` }
    ];
    
    params.forEach((param, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = col === 0 ? 1.5 : 6;
      slide2.addText(param.label, { x: xPos, y: 1.0 + row * 1.1, w: 3, h: 0.4, fontSize: 16, color: '666666', align: 'center' });
      slide2.addText(param.value, { x: xPos, y: 1.45 + row * 1.1, w: 3, h: 0.5, fontSize: 24, bold: true, color: '4DA3FF', align: 'center' });
    });
    
    slide2.addText(`💰 Налоговые поступления: ${Math.round(annualTax)} млн ₽/год`, { x: 0, y: 3.5, w: '100%', h: 0.5, fontSize: 18, color: '2ECC71', align: 'center' });
    slide2.addText(`🏭 Создание ${workers} прямых и ${Math.round(workers * 1.5)} косвенных рабочих мест`, { x: 0, y: 4.2, w: '100%', h: 0.5, fontSize: 16, color: '888888', align: 'center' });
    
    // СЛАЙД 3: 4 РЕНДЕРА
    const slide3 = pptx.addSlide();
    slide3.addText('Архитектурная концепция', { x: 0, y: 0.2, w: '100%', h: 0.7, fontSize: 32, bold: true, color: '4DA3FF', align: 'center' });
    
    const positions = [
      { x: 0.5, y: 1.0, w: 4.3, h: 1.8 },
      { x: 5.2, y: 1.0, w: 4.3, h: 1.8 },
      { x: 0.5, y: 3.1, w: 4.3, h: 1.8 },
      { x: 5.2, y: 3.1, w: 4.3, h: 1.8 }
    ];
    
    for (let i = 0; i < 4; i++) {
      slide3.addText(`📷 Визуализация ${i + 1}`, { x: positions[i].x, y: positions[i].y + 0.7, w: positions[i].w, h: 0.5, fontSize: 18, color: '999999', align: 'center' });
    }
    
    // СЛАЙД 4: СОЦИАЛЬНАЯ ИНФРАСТРУКТУРА
    const slide4 = pptx.addSlide();
    slide4.addText('Социальная инфраструктура', { x: 0, y: 0.2, w: '100%', h: 0.7, fontSize: 32, bold: true, color: '4DA3FF', align: 'center' });
    
    const facilities = [];
    if (kindergarten > 0) facilities.push({ icon: '🏫', name: 'Детский сад', count: `${Math.round(kindergarten * workers / 100)} мест` });
    if (housing > 0) facilities.push({ icon: '🏠', name: 'Жильё для сотрудников', count: `${housing}% (${housingType})` });
    if (medicalCost > 0) facilities.push({ icon: '🏥', name: 'Медпункт', count: 'круглосуточно' });
    if (diningCost > 0) facilities.push({ icon: '🍽️', name: 'Столовая', count: `${Math.round(workers * 0.7)} мест` });
    if (formData.sports?.length > 0) facilities.push({ icon: '⚽', name: 'Спортивные объекты', count: `${formData.sports.length} шт.` });
    if (formData.amenities?.length > 0) facilities.push({ icon: '🌳', name: 'Благоустройство', count: `${formData.amenities.length} элементов` });
    
    if (facilities.length <= 3) {
      facilities.push({ icon: '📚', name: 'Корпоративное обучение', count: 'программа повышения квалификации' });
      facilities.push({ icon: '🚌', name: 'Транспорт', count: 'развозка сотрудников' });
    }
    
    facilities.forEach((fac, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      slide4.addText(`${fac.icon} ${fac.name}`, { x: 1.2 + col * 4.2, y: 0.9 + row * 0.95, w: 3.5, h: 0.45, fontSize: 16, bold: true, color: '333333', align: 'center' });
      slide4.addText(fac.count, { x: 1.2 + col * 4.2, y: 1.35 + row * 0.95, w: 3.5, h: 0.4, fontSize: 14, color: '888888', align: 'center' });
    });
    
    slide4.addText('Преимущества для сотрудников:', { x: 0, y: 3.6, w: '100%', h: 0.45, fontSize: 16, bold: true, color: '333333', align: 'center' });
    slide4.addText('✓ ДМС  ✓  Корпоративный спорт  ✓  Обеды за счёт компании  ✓  Программа адаптации', { x: 0, y: 4.1, w: '100%', h: 0.4, fontSize: 15, color: '2ECC71', align: 'center' });
    
    // СЛАЙД 5: ИНФРАСТРУКТУРА ПЛОЩАДКИ
    const slide5 = pptx.addSlide();
    slide5.addText('Инфраструктура площадки', { x: 0, y: 0.2, w: '100%', h: 0.7, fontSize: 32, bold: true, color: '4DA3FF', align: 'center' });
    
    const infra = [
      { label: 'Магистральный газ', value: siteData.gas ? '✅ Подведён' : '❌ Требуется подведение' },
      { label: 'Электроэнергия', value: `${siteData.power_kva} кВА / требуется ${Math.round(requiredPower)} кВА` },
      { label: 'Ж/Д ветка', value: siteData.railway ? '✅ Есть' : '❌ Нет' },
      { label: 'Водоснабжение', value: 'Центральное (проектируется)' },
      { label: 'Канализация', value: 'Локальные очистные (проект)' },
      { label: 'Автодороги', value: `${siteData.highway_km} км до трассы` }
    ];
    
    infra.forEach((item, idx) => {
      slide5.addText(item.label, { x: 0.8, y: 1.0 + idx * 0.65, w: 3, h: 0.4, fontSize: 15, color: '555555' });
      slide5.addText(item.value, { x: 3.8, y: 1.0 + idx * 0.65, w: 5.5, h: 0.4, fontSize: 15, color: item.value.includes('✅') ? '2ECC71' : (item.value.includes('❌') ? 'E74C3C' : '333333') });
    });
    
    slide5.addText('Соответствие нормативам:', { x: 0, y: 4.2, w: '100%', h: 0.45, fontSize: 16, bold: true, color: '333333', align: 'center' });
    slide5.addText('✓ СанПиН 1.2.3685-21  |  ✓ СП 42.13330  |  ✓ Экологический класс', { x: 0, y: 4.7, w: '100%', h: 0.4, fontSize: 14, color: '2ECC71', align: 'center' });
    
    // СЛАЙД 6: ЭКОНОМИКА И ЛЬГОТЫ
    const slide6 = pptx.addSlide();
    slide6.addText('Экономический эффект', { x: 0, y: 0.2, w: '100%', h: 0.7, fontSize: 32, bold: true, color: '4DA3FF', align: 'center' });
    
    let yOffset = 1.0;
    slide6.addText('Налоговые преференции:', { x: 0.5, y: yOffset, w: 9, h: 0.45, fontSize: 18, bold: true, color: '333333' });
    yOffset += 0.55;
    
    const benefits = [
      regionData.tax_incentives && '• Льготы по налогу на прибыль (первые 5 лет)',
      regionData.economy?.reduced_insurance && '• Пониженные страховые взносы (7.6%)',
      '• Освобождение от налога на имущество (10 лет)',
      '• Ускоренная амортизация ОС'
    ].filter(Boolean);
    
    benefits.forEach((benefit) => {
      slide6.addText(benefit as string, { x: 0.7, y: yOffset, w: 8.8, h: 0.4, fontSize: 15, color: '2ECC71' });
      yOffset += 0.45;
    });
    
    yOffset += 0.3;
    slide6.addText(`💰 Общий объём инвестиций: ${Math.round(totalInvestment)} млн ₽`, { x: 0, y: yOffset, w: '100%', h: 0.55, fontSize: 24, bold: true, color: '4DA3FF', align: 'center' });
    yOffset += 0.7;
    slide6.addText(`📊 Налоговые поступления в бюджет: ${Math.round(annualTax)} млн ₽/год`, { x: 0, y: yOffset, w: '100%', h: 0.5, fontSize: 18, color: '333333', align: 'center' });
    yOffset += 0.6;
    slide6.addText(`👥 Создание ${workers} новых рабочих мест`, { x: 0, y: yOffset, w: '100%', h: 0.5, fontSize: 18, color: '333333', align: 'center' });
    
    return pptx;
  }
  
  downloadPresentation(pptx: any, regionName: string) {
    pptx.writeFile(`presentation_admin_${regionName.toLowerCase().replace(/\s/g, '_')}`);
  }
  
  async generatePresentation(regionData: any, siteData: any, formData: any): Promise<any> {
    return this.generateAdminPresentation(regionData, siteData, formData);
  }
}

export const presentationService = new PresentationService();