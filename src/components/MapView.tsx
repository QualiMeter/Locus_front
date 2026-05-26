import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { Region } from '../data';

import styles from './MapView.module.css';

interface Props {
    topRegions: Region[];
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
    return (
        <div className={styles.mapWrap}>
            <MapContainer
                center={[54.5, 44]}
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
                    (region, index) => (
                        <CircleMarker
                            key={region.id}
                            center={region.coords}
                            radius={
                                index === 0 ? 18 : 14
                            }
                            pathOptions={{
                                color:
                                    index === 0
                                        ? '#4DA3FF'
                                        : '#7C8AA5',

                                fillColor:
                                    index === 0
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
                    ),
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