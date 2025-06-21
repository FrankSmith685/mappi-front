import { useEffect, useRef, useState } from "react";

const useCurrentLocation = () => {
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permission, setPermission] = useState<PermissionState | null>(null);
    const watchId = useRef<number | null>(null);
    const hasRequestedPermission = useRef(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("La geolocalización no está soportada en este navegador");
            return;
        }

        if (!hasRequestedPermission.current) {
            hasRequestedPermission.current = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
                    setError(null);
                    startWatching();
                },
                (err) => {
                    console.error("Error al obtener la ubicación inicial:", err);
                    setError("No se pudo obtener la ubicación inicial.");
                   
                }
            );
        }

        navigator.permissions?.query({ name: "geolocation" }).then((result) => {
            setPermission(result.state);
            result.onchange = () => {
                setPermission(result.state);
                if (result.state === "granted") {
                    startWatching();
                    setError(null);
                } else {
                    stopWatching();
                    setError(null);
                }
            };
            if (result.state === "granted") {
                startWatching();
            }
        });
        return () => stopWatching();
    }, []);

    const startWatching = () => {
        if (watchId.current !== null) return;

        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
                setError(null);
            },
            (err) => {
                console.error("Error en watchPosition:", err);
                setError("Error en la actualización de la ubicación.");
               
            }
        );
    };

    const stopWatching = () => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    return { location, error, permission };
};

export default useCurrentLocation;
