import { useEffect, useState } from 'react';
import leaflet, { Map, LeafletMouseEvent, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Location = {
  latitude: string;
  longitude: string;
};

type LeafletMapProps = {
  onLocationClick: (location: Location) => void;
};

export default function LeafletMapAdd({ onLocationClick }: LeafletMapProps) {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [currentMarker, setCurrentMarker] = useState<Marker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function getPosition() {
    if ('geolocation' in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    if (position?.latitude && !map) {
      const myMap = leaflet
        .map('map')
        .setView([position?.latitude, position?.longitude], 15);

      setMap(myMap);
      setLoading(false);
    }
  }, [position]);

  useEffect(() => {
    if (map && position) {
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      leaflet
        .marker([position.latitude, position.longitude])
        .addTo(map)
        .bindPopup('You are here');
    }
  }, [map]);

  // Attach click handler to the map
  useEffect(() => {
    if (map) {
      const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Remove existing marker
        if (currentMarker) {
          currentMarker.remove();
        }

        // Add new marker
        const newMarker = leaflet
          .marker([lat, lng])
          .addTo(map)
          .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`);

        setCurrentMarker(newMarker);

        onLocationClick({
          latitude: lat.toString(),
          longitude: lng.toString(),
        });
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, currentMarker, onLocationClick]);

  return (
    <section>
      <div id='map' className='h-[700px] w-full'>
        {loading && <p>Loading map...</p>}
      </div>
    </section>
  );
}
