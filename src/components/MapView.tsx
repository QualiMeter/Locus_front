import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
} from 'react-leaflet';
import L from 'leaflet';
import { Region } from '../data';
import { RegionDto } from '../api';
import styles from './MapView.module.css';

interface Props {
    topRegions: (Region | RegionDto)[];
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '',
    iconUrl: '',
    shadowUrl: '',
});

export function MapView({ topRegions }: Props) {
    // Определяем центр карты на основе координат площадок
    const allSites = topRegions.flatMap((r) => r.top_sites || []);
    const mapCenter: [number, number] =
        allSites.length > 0
            ? allSites[0].coords
            : topRegions.length > 0
                ? topRegions[0].coords
                : [54.5, 44];

    return (
        <div className={styles.mapWrap}>
            <MapContainer
                center={mapCenter}
                zoom={4}
                scrollWheelZoom={true}
                className={styles.map}
                zoomControl={true}
            >
                <TileLayer
                    attribution=""
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {topRegions.map((region, regionIndex) => {
                    const sites = region.top_sites || [];

                    // Если есть площадки, рисуем маркеры для каждой
                    if (sites.length > 0) {
                        return sites.map((site, siteIndex) => {
                            const isBest = regionIndex === 0 && siteIndex === 0;
                            return (
                                <CircleMarker
                                    key={site.id}
                                    center={site.coords}
                                    radius={isBest ? 18 : 14}
                                    pathOptions={{
                                        color: isBest ? '#4DA3FF' : '#7C8AA5',
                                        fillColor: isBest ? '#4DA3FF' : '#7C8AA5',
                                        fillOpacity: 1,
                                        weight: 3,
                                    }}
                                >
                                    <Popup>
                                        <div className={styles.popup}>
                                            <div className={styles.popupTitle}>{site.name}</div>
                                            <div className={styles.popupRow}>
                                                <span>Регион</span>
                                                <strong>{region.name}</strong>
                                            </div>
                                            <div className={styles.popupRow}>
                                                <span>Спрос</span>
                                                <strong>
                                                    {(site.demand_score || region.demand_score).toFixed(2)}
                                                </strong>
                                            </div>
                                            <div className={styles.popupRow}>
                                                <span>Мощность</span>
                                                <strong>{site.power_kva} кВА</strong>
                                            </div>
                                            <div className={styles.popupRow}>
                                                <span>Стоимость</span>
                                                <strong>{site.cost_land.toLocaleString('ru-RU')} ₽</strong>
                                            </div>
                                            <div className={styles.popupRow}>
                                                <span>Площадь</span>
                                                <strong>{site.coords || 'N/A'} га</strong>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        });
                    }

                    // Если площадок нет, рисуем маркер региона
                    return (
                        <CircleMarker
                            key={region.id}
                            center={region.coords}
                            radius={regionIndex === 0 ? 18 : 14}
                            pathOptions={{
                                color: regionIndex === 0 ? '#4DA3FF' : '#7C8AA5',
                                fillColor: regionIndex === 0 ? '#4DA3FF' : '#7C8AA5',
                                fillOpacity: 1,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className={styles.popup}>
                                    <div className={styles.popupTitle}>{region.name}</div>
                                    <div className={styles.popupRow}>
                                        <span>Рейтинг</span>
                                        <strong>{region.rating}</strong>
                                    </div>
                                    <div className={styles.popupRow}>
                                        <span>Тариф</span>
                                        <strong>{region.electricity_tariff} ₽</strong>
                                    </div>
                                    <div className={styles.popupRow}>
                                        <span>Спрос</span>
                                        <strong>{region.demand_score.toFixed(2)}</strong>
                                    </div>
                                    <div className={styles.popupRow}>
                                        <span>Колледжи</span>
                                        <strong>{region.social.colleges}</strong>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={styles.legendDotPrimary} />
                    Лучшая площадка
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendDot} />
                    Остальные площадки
                </div>
            </div>
        </div>
    );
}