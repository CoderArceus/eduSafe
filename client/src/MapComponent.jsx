import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { API_URL } from './config';
// --- Icon Fix (no changes) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// --- End Icon Fix ---

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function MapEvents({ onBoundsChange, isProgrammaticMove }) {
    const map = useMapEvents({
        moveend: () => {
            if (isProgrammaticMove.current) {
                isProgrammaticMove.current = false;
                return;
            }
            onBoundsChange(map.getBounds());
        },
    });
    return null;
}

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom]);
    return null;
}

function MapComponent() {
    const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
    const [points, setPoints] = useState([]); // A single state for all dynamically loaded points
    const [userLocation, setUserLocation] = useState(null);
    const [nearestPoint, setNearestPoint] = useState(null);
    const [notification, setNotification] = useState('Pan the map or click "Find Nearest" to load safe points.');
    
    const debounceTimeout = useRef(null);
    const isProgrammaticMove = useRef(false);

    // --- THIS FUNCTION WAS MISSING AND HAS BEEN RESTORED ---
    const fetchMapPoints = useCallback((bounds) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
            setNotification('Searching for live data...');
            axios.get(`${API_URL}/api/map-points?bbox=${bbox}`)
                .then(response => {
                    setPoints(response.data); // Replace points with new live data
                    setNotification(`Loaded ${response.data.length} points from the live server.`);
                })
                .catch(error => {
                    console.error("Error fetching live map points:", error);
                    setNotification('Could not load live map data. The server may be busy.');
                });
        }, 500);
    }, []);

    const findNearestPoint = () => {
        setNotification('Requesting your location...');
        if (!navigator.geolocation) return setNotification('Geolocation is not supported.');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                setNotification('Location found. Searching for nearby safe points...');

                try {
                    const response = await axios.get(`${API_URL}/api/map-points/near?lat=${latitude}&lon=${longitude}`);
                    const nearbyPoints = response.data;

                    if (nearbyPoints.length === 0) {
                        setNotification('No safe points found within a 5km radius.');
                        return;
                    }
                    
                    setPoints(nearbyPoints);

                    let closest = null;
                    let minDistance = Infinity;

                    nearbyPoints.forEach(point => {
                        const distance = getDistanceFromLatLonInKm(latitude, longitude, point.lat, point.lon);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closest = point;
                        }
                    });

                    if (closest) {
                        setNearestPoint(closest);
                        isProgrammaticMove.current = true;
                        setMapCenter([closest.lat, closest.lon]);
                        setNotification(`Found nearest safe point: ${closest.name} (${minDistance.toFixed(2)} km away)`);
                    } else {
                        setNotification('Could not determine the nearest point.');
                    }
                } catch (error) {
                    console.error("Error in findNearestPoint flow:", error);
                    setNotification('Could not search for nearby points. The server may be busy.');
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setNotification('Error: Could not get your location. Please grant permission.');
            }
        );
    };

    return (
        <div>
            <button onClick={findNearestPoint} style={{ marginBottom: '1rem' }}>Find Nearest Safe Point</button>
            {notification && <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{notification}</p>}
            <MapContainer center={mapCenter} zoom={13} className="map-container">
                <ChangeView center={mapCenter} zoom={14} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents onBoundsChange={fetchMapPoints} isProgrammaticMove={isProgrammaticMove} />
                {userLocation && <Marker position={userLocation}><Popup>Your Location</Popup></Marker>}
                {points.map(point => (
                    <Marker key={point.id} position={[point.lat, point.lon]}>
                        <Popup autoOpen={nearestPoint && nearestPoint.id === point.id}>
                            <b>{point.name}</b> <br /> <span style={{ textTransform: 'capitalize' }}>{point.type}</span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapComponent;
