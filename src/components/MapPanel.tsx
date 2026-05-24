import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Region, Site } from '../types';
import './MapPanel.css';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  regions: Region[];
  sites: Site[];
}

const MapPanel: React.FC<Props> = ({ regions, sites }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([55.0, 50.0], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
    }).addTo(mapInstance.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker) mapInstance.current!.removeLayer(layer);
    });

    const sortedRegions = [...regions].sort((a, b) => b.rating - a.rating).slice(0, 3);

    sortedRegions.forEach((region, idx) => {
      const site = sites.find(s => s.region_id === region.id);
      if (!site) return;

      const colors = ['#4a9eca', '#f0a04b', '#6dbea0'];
      const color = colors[idx];

      const icon = L.divIcon({
        html: `<div class="custom-marker" style="background:${color}">
          <span>${idx + 1}</span>
        </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([site.coords[0], site.coords[1]], { icon })
        .bindPopup(`
          <div class="map-popup">
            <div class="map-popup__rank" style="color:${color}">#${idx + 1} — Рейтинг ${region.rating}</div>
            <div class="map-popup__name">${site.name}</div>
            <div class="map-popup__region">${region.name}</div>
            <div class="map-popup__stats">
              <span>${site.railway ? '🚆 Ж/Д' : '🚛 Авто'}</span>
              <span>⚡ ${site.power_kva} кВА</span>
              <span>🛣️ ${site.highway_km} км</span>
            </div>
          </div>
        `, { className: 'custom-popup' })
        .addTo(mapInstance.current!);
    });
  }, [regions, sites]);

  return (
    <div className="map-panel">
      <div className="map-panel__header">
        <span className="map-panel__icon">◉</span>
        ТОП‑3 региона с площадками
      </div>
      <div ref={mapRef} className="map-panel__map" />
    </div>
  );
};

export default MapPanel;
