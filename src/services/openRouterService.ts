export interface LLMAnalytics {
	investmentVerdict: string;
	riskRecommendations: string[];
	hrForecast: string;
	ecologyRecommendation: string;
	logisticsOptimization: string;
	opexForecast: {
		energy: string;
		payroll: string;
	};
	benchmarking: string;
	presentationReady: string;
}

class OpenRouterService {
	private apiKey: string | null = null;
	private useMock = true;

	configure(config: { apiKey: string }) {
		this.apiKey = config.apiKey;
		this.useMock = false;
		console.log('OpenRouter API настроен');
	}

	async generateAnalytics(
		regionData: any,
		siteData: any,
		formData: any
	): Promise<LLMAnalytics> {
		if (this.useMock || !this.apiKey) {
			console.log('OpenRouter не настроен, используем локальную генерацию');
			return this.generateMockAnalytics(regionData, siteData, formData);
		}

		try {
			const prompt = this.buildPrompt(regionData, siteData, formData);
			const response = await this.callOpenRouter(prompt);
			return this.parseResponse(response, regionData, siteData, formData);
		} catch (error) {
			console.error('❌ OpenRouter API error:', error);
			return this.generateMockAnalytics(regionData, siteData, formData);
		}
	}

	private async callOpenRouter(prompt: string): Promise<string> {
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.apiKey}`,
				'HTTP-Referer': window.location.origin,
				'X-Title': 'Locus Analytics'
			},
			body: JSON.stringify({
				model: 'openrouter/free',
				messages: [
					{
						role: 'system',
						content: 'Ты эксперт по инвестиционной привлекательности регионов России. Отвечай на русском языке. Возвращай только JSON без пояснений.'
					},
					{
						role: 'user',
						content: prompt
					}
				],
				temperature: 0.7,
				max_tokens: 2000
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
		}

		const data = await response.json();
		return data.choices[0].message.content;
	}

	private buildPrompt(regionData: any, siteData: any, formData: any): string {
		const volume = Number(formData.volume || 0);
		const workers = Number(formData.workers || 0);
		const budget = Number(formData.budget || 0);
		const kindergarten = Number(formData.kindergarten || 0);
		const housing = Number(formData.housing || 0);
		const housingType = formData.housingType === 'dormitory' ? 'общежитие' : 'квартиры';

		return `
Ты эксперт по инвестиционной привлекательности. Верни строго JSON без пояснений.

ДАННЫЕ РЕГИОНА "${regionData.name}":
- Рейтинг: ${regionData.rating}/100
- Налоговые льготы: ${regionData.tax_incentives ? 'Да' : 'Нет'}
- Страховые взносы: ${regionData.economy?.reduced_insurance ? '7.6%' : '30%'}
- Энерготариф: ${regionData.electricity_tariff} ₽/кВт·ч
- Расстояние до стали: ${regionData.steel_dist} км
- Спрос: ${(regionData.demand_score * 100).toFixed(0)}%
- Средняя зарплата: ${regionData.economy?.avg_salary?.toLocaleString()} ₽
- Экокласс: ${regionData.economy?.ecology_class || 3}
- Колледжи: ${regionData.social?.colleges || 0}
- Аренда жилья: ${regionData.social?.rent_1room?.toLocaleString()} ₽
- Детсады: ${regionData.social?.kindergarten_load || 0}

ПЛОЩАДКА "${siteData.name}":
- Газ: ${siteData.gas ? 'Да' : 'Нет'}
- Мощность: ${siteData.power_kva} кВА
- Ж/Д: ${siteData.railway ? 'Да' : 'Нет'}
- Расстояние до трассы: ${siteData.highway_km} км

ПРОЕКТ:
- Объём выпуска: ${volume} тыс. м²/год
- Сотрудников: ${workers} чел.
- Бюджет: ${budget} млн ₽
- Детский сад: ${kindergarten > 0 ? `${Math.round(kindergarten * workers / 100)} мест` : 'нет'}
- Жильё: ${housing > 0 ? `${housing}% (${housingType})` : 'нет'}

Верни JSON:
{
  "investmentVerdict": "оценка привлекательности (1-2 предложения)",
  "riskRecommendations": ["рекомендация 1", "рекомендация 2", "рекомендация 3"],
  "hrForecast": "кадровый прогноз",
  "ecologyRecommendation": "эко-рекомендация",
  "logisticsOptimization": "логистическая оптимизация",
  "opexEnergy": "прогноз затрат на энергию в млн ₽/год",
  "opexPayroll": "прогноз ФОТ в млн ₽/мес",
  "benchmarking": "сравнение с другими регионами",
  "presentationReady": "текст для презентации"
}`;
	}

	private parseResponse(response: string, regionData: any, siteData: any, formData: any): LLMAnalytics {
		try {
			const jsonMatch = response.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]);
				return {
					investmentVerdict: parsed.investmentVerdict || this.generateMockInvestmentVerdict(regionData),
					riskRecommendations: parsed.riskRecommendations || this.generateMockRiskRecommendations(regionData, siteData),
					hrForecast: parsed.hrForecast || this.generateMockHRForecast(regionData, formData),
					ecologyRecommendation: parsed.ecologyRecommendation || this.generateMockEcologyRecommendation(regionData),
					logisticsOptimization: parsed.logisticsOptimization || this.generateMockLogisticsOptimization(regionData),
					opexForecast: {
						energy: parsed.opexEnergy || this.generateMockOpexEnergy(regionData, formData),
						payroll: parsed.opexPayroll || this.generateMockOpexPayroll(regionData, formData),
					},
					benchmarking: parsed.benchmarking || this.generateMockBenchmarking(regionData),
					presentationReady: parsed.presentationReady || this.generateMockPresentationText(regionData, formData),
				};
			}
		} catch (e) {
			console.error('Failed to parse response:', e);
		}
		return this.generateMockAnalytics(regionData, siteData, formData);
	}


	private generateMockAnalytics(regionData: any, siteData: any, formData: any): LLMAnalytics {
		return {
			investmentVerdict: this.generateMockInvestmentVerdict(regionData),
			riskRecommendations: this.generateMockRiskRecommendations(regionData, siteData),
			hrForecast: this.generateMockHRForecast(regionData, formData),
			ecologyRecommendation: this.generateMockEcologyRecommendation(regionData),
			logisticsOptimization: this.generateMockLogisticsOptimization(regionData),
			opexForecast: {
				energy: this.generateMockOpexEnergy(regionData, formData),
				payroll: this.generateMockOpexPayroll(regionData, formData),
			},
			benchmarking: this.generateMockBenchmarking(regionData),
			presentationReady: this.generateMockPresentationText(regionData, formData),
		};
	}

	private generateMockInvestmentVerdict(regionData: any): string {
		if (regionData.tax_incentives) {
			return `Регион "${regionData.name}" обладает высокой инвестиционной привлекательностью.`;
		}
		return `Средняя инвестиционная привлекательность региона "${regionData.name}".`;
	}

	private generateMockRiskRecommendations(regionData: any, siteData: any): string[] {
		const recs = [];
		if (regionData.social?.rent_1room > 35000) recs.push('Высокая аренда жилья → построить общежитие.');
		if (siteData.highway_km > 15) recs.push('Удалённость от города → организовать транспорт.');
		if (!siteData.gas) recs.push('Отсутствие газа → предусмотреть альтернативы.');
		if (recs.length === 0) recs.push('Условия благоприятные.');
		return recs;
	}

	private generateMockHRForecast(regionData: any, formData: any): string {
		const workers = Number(formData.workers || 0);
		return `В регионе ${regionData.social?.colleges || 0} колледжей. Закрытие ${workers} вакансий за 2-3 месяца.`;
	}

	private generateMockEcologyRecommendation(regionData: any): string {
		const ecClass = regionData.economy?.ecology_class || 3;
		if (ecClass >= 4) return `Экокласс ${ecClass} → требуется усиленная очистка.`;
		return `Экокласс ${ecClass} → стандартных мер достаточно.`;
	}

	private generateMockLogisticsOptimization(regionData: any): string {
		return `Расстояние до стали ${regionData.steel_dist} км.`;
	}

	private generateMockOpexEnergy(regionData: any, formData: any): string {
		const volume = Number(formData.volume || 0);
		const power = 300 + (volume / 1000) * 400;
		const cost = power * 0.72 * 24 * 365 * regionData.electricity_tariff / 1e6;
		return `${cost.toFixed(1)} млн ₽/год`;
	}

	private generateMockOpexPayroll(regionData: any, formData: any): string {
		const workers = Number(formData.workers || 0);
		const rate = regionData.economy?.reduced_insurance ? 1.076 : 1.3;
		const fot = regionData.economy?.avg_salary * workers * rate / 1e6;
		return `${fot.toFixed(1)} млн ₽/мес`;
	}

	private generateMockBenchmarking(regionData: any): string {
		return `Регион занимает ${regionData.rating > 80 ? 'высокие' : 'средние'} позиции.`;
	}

	private generateMockPresentationText(regionData: any, formData: any): string {
		const workers = Number(formData.workers || 0);
		const budget = Number(formData.budget || 0);
		return `Проект в ${regionData.name}: ${workers} рабочих мест, ${Math.round(budget * 0.15)} млн ₽ налогов/год.`;
	}
}

export const openRouterService = new OpenRouterService();