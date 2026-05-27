export interface PresentationData {
  regionId: string;
  regionName: string;
  generatedAt: string;
  formData: any;
  regionData: any;
  siteData: any;
}

class PresentationService {
  async generatePresentation(
    regionData: any, 
    siteData: any, 
    formData: any
  ): Promise<string> {
    try {
      // Пытаемся отправить запрос к API (если бэкенд поддержит)
      const response = await fetch('https://locusback.up.railway.app/api/generate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: regionData,
          site: siteData,
          formData: formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.presentation;
      }
    } catch (error) {
      console.log('AI API недоступен, используем локальную генерацию');
    }
    
    return this.generatePresentationFromData(regionData, siteData, formData);
  }

  private generatePresentationFromData(regionData: any, siteData: any, formData: any): string {
    const volume = Number(formData.volume || 0);
    const workers = Number(formData.workers || 0);
    const budget = Number(formData.budget || 0);
    const kindergarten = Number(formData.kindergarten || 0);
    const housing = Number(formData.housing || 0);

    const requiredPower = 300 + (volume / 1000) * 400;
    const connectionCost = (siteData.connection_rub_per_kw || 4500) * requiredPower;
    const totalLandConn = (siteData.cost_land || 0) + connectionCost;
    
    const workshopCost = volume * 0.4 * 35000;
    const roadsCost = workers * 0.5 * 25 * 5000;
    const kindergartenCost = kindergarten * (workers / 100) * 15 * 50000;
    const housingRate = formData.housingType === 'dormitory' ? 70000 : 90000;
    const housingCost = housing > 0 ? workers * (housing / 100) * housingRate : 0;
    const totalEstimate = (workshopCost + roadsCost + kindergartenCost + housingCost) / 1e6;

    // Определяем цветовую схему для региона (из культурных данных)
    const colors = regionData.cultural?.colors_authentic || ['#4da3ff', '#236bff', '#2ecc71'];
    
    // Формируем преимущества на основе данных
    const advantages = [];
    if (regionData.tax_incentives) advantages.push('Налоговые льготы и преференции');
    if (regionData.economy?.reduced_insurance) advantages.push('Сниженные страховые взносы (7.6%)');
    if (regionData.steel_dist < 200) advantages.push('Близость к поставщикам стали');
    if (regionData.demand_score > 0.8) advantages.push('Высокий спрос на продукцию');
    if (regionData.social?.colleges > 15) advantages.push('Развитая система профильного образования');
    if (siteData.railway) advantages.push('Наличие ж/д ветки');
    if (siteData.gas) advantages.push('Подведён магистральный газ');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Презентация: ${regionData.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 40px;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .slide {
            background: white;
            border-radius: 28px;
            padding: 48px;
            margin-bottom: 32px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            transition: transform 0.3s ease;
          }
          .slide:hover { transform: translateY(-4px); }
          h1 {
            font-size: 3rem;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || '#764ba2'} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 16px;
          }
          h2 {
            color: #1e293b;
            border-left: 4px solid ${colors[0]};
            padding-left: 20px;
            margin: 32px 0 24px;
            font-size: 1.6rem;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 24px;
            margin: 32px 0;
          }
          .metric-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 24px;
            border-radius: 20px;
            text-align: center;
            transition: all 0.3s;
            border: 1px solid #e2e8f0;
          }
          .metric-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          }
          .metric-value {
            font-size: 2.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || '#764ba2'} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .metric-label {
            color: #64748b;
            margin-top: 12px;
            font-size: 0.85rem;
            font-weight: 500;
          }
          .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 600;
            margin: 4px;
          }
          .badge-positive { background: #d1fae5; color: #065f46; }
          .badge-warning { background: #fed7aa; color: #92400e; }
          .badge-info { background: #dbeafe; color: #1e40af; }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .advantage-list {
            list-style: none;
            padding: 0;
          }
          .advantage-list li {
            padding: 12px 0;
            padding-left: 28px;
            position: relative;
            border-bottom: 1px solid #f1f5f9;
          }
          .advantage-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: ${colors[0]};
            font-weight: bold;
            font-size: 1.2rem;
          }
          .footer {
            text-align: center;
            margin-top: 48px;
            color: rgba(255,255,255,0.7);
            padding: 20px;
          }
          @media (max-width: 768px) {
            .slide { padding: 24px; }
            h1 { font-size: 2rem; }
            h2 { font-size: 1.3rem; }
            .metric-value { font-size: 1.6rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Титульный слайд -->
          <div class="slide">
            <h1>${regionData.name}</h1>
            <p style="font-size: 1.1rem; color: #475569; margin: 16px 0;">Инвестиционная привлекательность для производства сэндвич-панелей</p>
            <div style="margin: 32px 0;">
              <span class="badge badge-positive">⭐ Рейтинг: ${regionData.rating}/100</span>
              ${regionData.tax_incentives ? '<span class="badge badge-positive">🏛 Налоговые льготы</span>' : ''}
              ${regionData.economy?.reduced_insurance ? '<span class="badge badge-positive">💰 Страховые взносы 7.6%</span>' : ''}
              <span class="badge badge-info">📈 Спрос: ${(regionData.demand_score * 100).toFixed(0)}%</span>
            </div>
            <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 24px;">📅 Сгенерировано Locus AI | ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>

          <!-- Производственные показатели -->
          <div class="slide">
            <h2>📊 Параметры производства</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value">${volume} тыс. м²</div>
                <div class="metric-label">Годовой объём выпуска</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${workers} чел.</div>
                <div class="metric-label">Штат сотрудников</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${budget} млн ₽</div>
                <div class="metric-label">Бюджет проекта</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${Math.round(requiredPower)} кВА</div>
                <div class="metric-label">Требуемая мощность</div>
              </div>
            </div>
          </div>

          <!-- Экономика региона -->
          <div class="slide">
            <h2>💰 Экономические показатели</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value">${regionData.economy?.avg_salary?.toLocaleString() || 'N/A'} ₽</div>
                <div class="metric-label">Средняя зарплата</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${regionData.electricity_tariff || 'N/A'} ₽/кВт·ч</div>
                <div class="metric-label">Тариф на электроэнергию</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${regionData.social?.colleges || 'N/A'}</div>
                <div class="metric-label">Профильных колледжей</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${regionData.social?.rent_1room?.toLocaleString() || 'N/A'} ₽</div>
                <div class="metric-label">Аренда 1-комн. квартиры</div>
              </div>
            </div>
          </div>

          <!-- Логистика -->
          <div class="slide">
            <h2>🚚 Логистический потенциал</h2>
            <div class="info-row">
              <span>🏭 Расстояние до стали:</span>
              <strong>${regionData.steel_dist || 'N/A'} км</strong>
            </div>
            <div class="info-row">
              <span>🧱 Расстояние до утеплителя:</span>
              <strong>${regionData.insulation_dist || 'N/A'} км</strong>
            </div>
            <div class="info-row">
              <span>🛣 Расстояние до трассы (площадка):</span>
              <strong>${siteData.highway_km || 'N/A'} км</strong>
            </div>
            <div class="info-row">
              <span>🚂 Наличие Ж/Д:</span>
              <strong>${siteData.railway ? '✅ Да' : '❌ Нет'}</strong>
            </div>
          </div>

          <!-- Преимущества -->
          <div class="slide">
            <h2>✨ Ключевые преимущества</h2>
            <ul class="advantage-list">
              ${advantages.map(adv => `<li>${adv}</li>`).join('')}
              ${advantages.length === 0 ? '<li>Развивающийся регион с потенциалом роста</li>' : ''}
            </ul>
          </div>

          <!-- Инвестиционная смета -->
          <div class="slide">
            <h2>🧮 Укрупнённая смета</h2>
            <div class="info-row">
              <span>🏭 Цех и склад:</span>
              <strong>${Math.round(workshopCost / 1e6).toLocaleString()} млн ₽</strong>
            </div>
            <div class="info-row">
              <span>🛣 Дороги и АБК:</span>
              <strong>${Math.round(roadsCost / 1e6).toLocaleString()} млн ₽</strong>
            </div>
            ${kindergartenCost > 0 ? `
            <div class="info-row">
              <span>🏫 Детский сад:</span>
              <strong>${Math.round(kindergartenCost / 1e6).toLocaleString()} млн ₽</strong>
            </div>
            ` : ''}
            ${housingCost > 0 ? `
            <div class="info-row">
              <span>🏠 Жильё для сотрудников:</span>
              <strong>${Math.round(housingCost / 1e6).toLocaleString()} млн ₽</strong>
            </div>
            ` : ''}
            <div class="info-row" style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; font-weight: 700;">
              <span>ИТОГО (оценка):</span>
              <strong style="color: ${colors[0]}; font-size: 1.2rem;">${Math.round(totalEstimate).toLocaleString()} млн ₽</strong>
            </div>
            <p style="margin-top: 20px; color: #64748b; font-size: 0.8rem;">* Смета является укрупнённой и требует детального расчёта</p>
          </div>

          <!-- Финальный слайд -->
          <div class="slide">
            <h2>📞 Следующие шаги</h2>
            <p style="margin-bottom: 20px; line-height: 1.6;">Для дальнейшего анализа и получения более детальной информации:</p>
            <ul class="advantage-list">
              <li>Запросите технические условия на подключение к сетям</li>
              <li>Проведите детальный аудит выбранной площадки</li>
              <li>Сформируйте бизнес-план с учётом региональных особенностей</li>
              <li>Свяжитесь с региональным центром поддержки инвестиций</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>Locus — умный подбор локации для производства | Данные основаны на открытых источниках</p>
        </div>
      </body>
      </html>
    `;
  }

  downloadPresentation(htmlContent: string, regionName: string) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presentation_${regionName.toLowerCase().replace(/\s/g, '_')}_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const presentationService = new PresentationService();