import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SITES, Region } from '../data';
import styles from './MapView.module.css';

// Fix leaflet default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  topRegions: Region[];
}

export const MapView: React.FC<Props> = ({ topRegions }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current).setView([55.0, 50.0], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
    }).addTo(mapRef.current);
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer(layer => { if (layer instanceof L.Marker) layer.remove(); });
    topRegions.forEach(region => {
      const site = SITES.find(s => s.region_id === region.id);
      if (!site) return;
      const marker = L.marker([site.coords[0], site.coords[1]]);
      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif; min-width:200px; padding:4px">
          <strong style="font-size:0.95rem">${site.name}</strong><br/>
          <span style="color:#7A7A72; font-size:0.8rem">${region.name}</span><br/>
          <hr style="margin:8px 0; border-color:#eee"/>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; font-size:0.78rem">
            <span>🚂 ЖД</span><span>${site.railway ? '✅ Да' : '❌ Нет'}</span>
            <span>⛽ Газ</span><span>${site.gas ? '✅ Да' : '❌ Нет'}</span>
            <span>⚡ Мощность</span><span>${site.power_kva} кВА</span>
            <span>🛣 До трассы</span><span>${site.highway_km} км</span>
            <span>⭐ Рейтинг</span><span>${region.rating}/100</span>
          </div>
        </div>
      `);
      marker.addTo(mapRef.current!);
    });
  }, [topRegions]);

  return <div ref={containerRef} className={styles.map} />;
};
