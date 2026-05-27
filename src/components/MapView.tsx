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

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '',
    iconUrl: '',
    shadowUrl: '',
});

export function MapView({
    topRegions,
}: Props) {
    const mapCenter: [number, number] = topRegions.length > 0 && topRegions[0].top_sites && topRegions[0].top_sites.length > 0
        ? topRegions[0].top_sites[0].coords
        : topRegions.length > 0
            ? topRegions[0].coords
            : [54.5, 44];

    return (
        <div className={styles.mapWrap}>
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
                        const sites = region.top_sites || [];
                        if (sites.length === 0) {
                            return (
                                <CircleMarker
                                    key={region.id}
                                    center={region.coords}
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
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ));
                    },
                )}
            </MapContainer>

            <div className={styles.legend}>
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
            </div>
        </div>
    );
}