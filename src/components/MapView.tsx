<<<<<<< HEAD
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

delete (L.Icon.Default.prototype as any)
    ._getIconUrl;

=======
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
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '',
    iconUrl: '',
    shadowUrl: '',
});

<<<<<<< HEAD
export function MapView({
    topRegions,
}: Props) {
    const mapCenter: [number, number] = topRegions.length > 0 && topRegions[0].top_sites && topRegions[0].top_sites.length > 0
        ? topRegions[0].top_sites[0].coords
        : topRegions.length > 0
=======
export function MapView({ topRegions = [], initialSites }: Props) {
    const mapCenter: [number, number] = initialSites?.length
        ? initialSites[0].coords
        : topRegions.length
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
            ? topRegions[0].coords
            : [54.5, 44];

    return (
        <div className={styles.mapWrap}>
<<<<<<< HEAD
            <MapContainer
                center={mapCenter}
                zoom={4}
                scrollWheelZoom={false}
                className={styles.map}
                zoomControl={false}
            >
                <TileLayer
                    attribution=""
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {topRegions.map(
                    (region, regionIndex) => {
=======
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
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
                        const sites = region.top_sites || [];
                        if (sites.length === 0) {
                            return (
                                <CircleMarker
                                    key={region.id}
                                    center={region.coords}
<<<<<<< HEAD
                                    radius={regionIndex === 0 ? 18 : 14}
                                    pathOptions={{
                                        color:
                                            regionIndex === 0
                                                ? '#4DA3FF'
                                                : '#7C8AA5',
                                        fillColor:
                                            regionIndex === 0
                                                ? '#4DA3FF'
                                                : '#7C8AA5',
                                        fillOpacity: 1,
                                        weight: 3,
                                    }}
                                >
                                    <Popup>
                                        <div className={styles.popup}>
                                            <div
                                                className={
                                                    styles.popupTitle
                                                }
                                            >
                                                {region.name}
                                            </div>

                                            <div
                                                className={
                                                    styles.popupRow
                                                }
                                            >
                                                <span>
                                                    Рейтинг
                                                </span>

                                                <strong>
                                                    {region.rating}
                                                </strong>
                                            </div>

                                            <div
                                                className={
                                                    styles.popupRow
                                                }
                                            >
                                                <span>
                                                    Тариф
                                                </span>

                                                <strong>
                                                    {
                                                        region.electricity_tariff
                                                    }{' '}
                                                    ₽
                                                </strong>
                                            </div>

                                            <div
                                                className={
                                                    styles.popupRow
                                                }
                                            >
                                                <span>
                                                    Спрос
                                                </span>

                                                <strong>
                                                    {region.demand_score.toFixed(
                                                        2,
                                                    )}
                                                </strong>
                                            </div>

                                            <div
                                                className={
                                                    styles.popupRow
                                                }
                                            >
                                                <span>
                                                    Колледжи
                                                </span>

                                                <strong>
                                                    {
                                                        region.social
                                                            .colleges
                                                    }
                                                </strong>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        }

                        return sites.map((site, siteIndex) => (
                            <CircleMarker
                                key={site.id}
                                center={site.coords}
                                radius={regionIndex === 0 && siteIndex === 0 ? 18 : 14}
                                pathOptions={{
                                    color:
                                        regionIndex === 0 && siteIndex === 0
                                            ? '#4DA3FF'
                                            : '#7C8AA5',
                                    fillColor:
                                        regionIndex === 0 && siteIndex === 0
                                            ? '#4DA3FF'
                                            : '#7C8AA5',
                                    fillOpacity: 1,
                                    weight: 3,
                                }}
                            >
                                <Popup>
                                    <div className={styles.popup}>
                                        <div
                                            className={
                                                styles.popupTitle
                                            }
                                        >
                                            {site.name}
                                        </div>

                                        <div
                                            className={
                                                styles.popupRow
                                            }
                                        >
                                            <span>
                                                Регион
                                            </span>

                                            <strong>
                                                {region.name}
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.popupRow
                                            }
                                        >
                                            <span>
                                                Спрос
                                            </span>

                                            <strong>
                                                {(site.demand_score || region.demand_score).toFixed(
                                                    2,
                                                )}
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.popupRow
                                            }
                                        >
                                            <span>
                                                Мощность
                                            </span>

                                            <strong>
                                                {site.power_kva} кВА
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.popupRow
                                            }
                                        >
                                            <span>
                                                Стоимость
                                            </span>

                                            <strong>
                                                {site.cost_land} ₽
                                            </strong>
                                        </div>
=======
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
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ));
<<<<<<< HEAD
                    },
=======
                    })
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
                )}
            </MapContainer>

            <div className={styles.legend}>
<<<<<<< HEAD
                <div
                    className={styles.legendItem}
                >
                    <span
                        className={
                            styles.legendDotPrimary
                        }
                    />

                    Лучший регион
                </div>

                <div
                    className={styles.legendItem}
                >
                    <span
                        className={
                            styles.legendDot
                        }
                    />

                    Остальные регионы
                </div>
=======
                <div className={styles.legendItem}><span className={styles.legendDotPrimary} /> Лучшая площадка</div>
                <div className={styles.legendItem}><span className={styles.legendDot} /> Остальные площадки</div>
>>>>>>> 3807758af26c7c22f320ad4d4846728bd3292dac
            </div>
        </div>
    );
}