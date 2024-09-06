import leaflet, { LeafletMouseEvent, Map } from 'leaflet';
import { useEffect, useState } from 'react';
import { Quiz, Location } from '../types';

type LeafletMapEditProps = {
  selectedQuiz: Quiz | null;
  onLocationClick: (location: Location) => void;
};

export default function LeafletMapEdit({
  selectedQuiz,
  onLocationClick,
}: LeafletMapEditProps) {
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [currentMarker, setCurrentMarker] = useState<leaflet.Marker | null>(
    null
  );

  function getCurrentPosition() {
    if ('geolocation' in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    getCurrentPosition();
  });

  useEffect(() => {
    if (position?.latitude && !map) {
      const myMap = leaflet
        .map('map')
        .setView([position?.latitude, position.longitude], 15);
      setMap(myMap);
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

  useEffect(() => {
    if (map) {
      const handleMapClick = (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (currentMarker) {
          currentMarker.remove();
        }

        // Add new marker
        const newMarker = leaflet
          .marker([lat, lng])
          .addTo(map)
          .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`)
          .openPopup();

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

  useEffect(() => {
    if (map && selectedQuiz && position?.latitude && position?.longitude) {
      map.eachLayer((layer) => {
        if (layer instanceof leaflet.Marker) {
          map.removeLayer(layer);
        }
      });

      leaflet
        .marker([position?.latitude, position?.longitude])
        .addTo(map)
        .bindPopup('You are here');

      selectedQuiz.questions.forEach((question) => {
        const { latitude, longitude } = question.location;
        leaflet
          .marker([parseFloat(latitude), parseFloat(longitude)])
          .addTo(map)
          .bindPopup(
            `<b>Question:</b> ${question.question}<br/><b>Answer:</b> ${question.answer}`
          );
      });
    }
  }, [map, selectedQuiz, position]);
  return (
    <>
      <section className='flex items-center justify-center self-center mt-6'>
        <div id='map' className='h-[700px] w-full'></div>
      </section>
    </>
  );
}
