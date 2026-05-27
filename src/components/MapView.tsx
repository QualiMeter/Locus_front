import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Region, Site } from '../data';
import { RegionDto, SiteDto } from '../api';
import styles from './MapView.module.css';

interface Props {
    topRegions?: (Region | RegionDto)[];
    initialSites?: (Site | SiteDto)[];
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '',
    iconUrl: '',
    shadowUrl: '',
});

export function MapView({ topRegions = [], initialSites }: Props) {
    const mapCenter: [number, number] = initialSites?.length
        ? initialSites[0].coords
        : topRegions.length
            ? topRegions[0].coords
            : [54.5, 44];

    return (
        <div className={styles.mapWrap}>
            <MapContainer center={mapCenter} zoom={4} scrollWheelZoom className={styles.map} zoomControl>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                {initialSites ? (
                    // 🟢 Режим "Каталог": рисуем все площадки напрямую
                    initialSites.map((site, idx) => (
                        <CircleMarker
                            key={site.id}
                            center={site.coords}
                            radius={idx === 0 ? 18 : 14}
                            pathOptions={{
                                color: idx === 0 ? '#4DA3FF' : '#7C8AA5',
                                fillColor: idx === 0 ? '#4DA3FF' : '#7C8AA5',
                                fillOpacity: 1,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className={styles.popup}>
                                    <div className={styles.popupTitle}>{site.name}</div>
                                    <div className={styles.popupRow}><span>Регион ID</span><strong>{site.region_id}</strong></div>
                                    <div className={styles.popupRow}><span>Мощность</span><strong>{site.power_kva} кВА</strong></div>
                                    <div className={styles.popupRow}><span>Стоимость</span><strong>{site.cost_land.toLocaleString('ru-RU')} ₽</strong></div>
                                    <div className={styles.popupRow}><span>Ж/Д</span><strong>{site.railway ? '✅' : '❌'}</strong></div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))
                ) : (
                    // 🔵 Режим "Результат анализа": рисуем через регионы
                    topRegions.map((region, rIdx) => {
                        const sites = region.top_sites || [];
                        if (sites.length === 0) {
                            return (
                                <CircleMarker
                                    key={region.id}
                                    center={region.coords}
                                    radius={rIdx === 0 ? 18 : 14}
                                    pathOptions={{ color: rIdx === 0 ? '#4DA3FF' : '#7C8AA5', fillColor: rIdx === 0 ? '#4DA3FF' : '#7C8AA5', fillOpacity: 1, weight: 3 }}
                                >
                                    <Popup><div className={styles.popup}><div className={styles.popupTitle}>{region.name}</div></div></Popup>
                                </CircleMarker>
                            );
                        }
                        return sites.map((site, sIdx) => (
                            <CircleMarker
                                key={site.id}
                                center={site.coords}
                                radius={rIdx === 0 && sIdx === 0 ? 18 : 14}
                                pathOptions={{ color: rIdx === 0 && sIdx === 0 ? '#4DA3FF' : '#7C8AA5', fillColor: rIdx === 0 && sIdx === 0 ? '#4DA3FF' : '#7C8AA5', fillOpacity: 1, weight: 3 }}
                            >
                                <Popup>
                                    <div className={styles.popup}>
                                        <div className={styles.popupTitle}>{site.name}</div>
                                        <div className={styles.popupRow}><span>Регион</span><strong>{region.name}</strong></div>
                                        <div className={styles.popupRow}><span>Спрос</span><strong>{(site.demand_score || 0).toFixed(2)}</strong></div>
                                        <div className={styles.popupRow}><span>Мощность</span><strong>{site.power_kva} кВА</strong></div>
                                        <div className={styles.popupRow}><span>Стоимость</span><strong>{site.cost_land.toLocaleString('ru-RU')} ₽</strong></div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ));
                    })
                )}
            </MapContainer>

            <div className={styles.legend}>
                <div className={styles.legendItem}><span className={styles.legendDotPrimary} /> Лучшая площадка</div>
                <div className={styles.legendItem}><span className={styles.legendDot} /> Остальные площадки</div>
            </div>
        </div>
    );
}