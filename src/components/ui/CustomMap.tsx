/* eslint-disable react-hooks/exhaustive-deps */
// components/CustomMap.tsx
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  icon?: string;
  title?: string;
}

interface CustomMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  draggable?: boolean;
  mapContainerStyle?: React.CSSProperties;
  icon?: string;
  options?: google.maps.MapOptions;
  additionalMarkers?: MarkerData[];
  onLoad?: (map: google.maps.Map) => void;
  onMarkerDragEnd?: (position: google.maps.LatLngLiteral) => void;
  onClickMarker?: (marker: MarkerData) => void;
  activeMarker?: boolean;
  mapCenterService?:{lat:number, lng: number} | null
}

const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "road",
    stylers: [
      { hue: "#5e00ff" },
      { saturation: -79 },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      { saturation: -78 },
      { hue: "#6600ff" },
      { lightness: -47 },
      { visibility: "off" },
    ],
  },
  {
    featureType: "road.local",
    stylers: [
      { lightness: 22 },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      { hue: "#6600ff" },
      { saturation: -11 },
    ],
  },
  {
    featureType: "water",
    stylers: [
      { saturation: -65 },
      { hue: "#1900ff" },
      { lightness: 8 },
    ],
  },
  {
    featureType: "road.local",
    stylers: [
      { weight: 1.3 },
      { lightness: 30 },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      { visibility: "simplified" },
      { hue: "#5e00ff" },
      { saturation: -16 },
    ],
  },
  {
    featureType: "transit.line",
    stylers: [
      { saturation: -72 },
    ],
  }
];

const defaultContainerStyle = {
  width: "100%",
  height: "400px",
};

const CustomMap: FC<CustomMapProps> = ({
  lat,
  lng,
  zoom = 15,
  draggable = false,
  mapContainerStyle = defaultContainerStyle,
  icon,
  options = {},
  additionalMarkers = [],
  onLoad,
  onMarkerDragEnd,
  onClickMarker,
  activeMarker = false,
  mapCenterService
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const [mainMarkerPosition, setMainMarkerPosition] =
    useState<google.maps.LatLngLiteral>({ lat, lng });

//   useEffect(() => {
//   if (mapRef.current && mapCenterService) {
//     mapRef.current.panTo(mapCenterService);
//     mapRef.current.setZoom(19);
//   }
// }, [mapRef.current, mapCenterService?.lat, mapCenterService?.lng]);

useEffect(() => {
  if (
    mapRef.current &&
    mapCenterService &&
    Number.isFinite(mapCenterService.lat) &&
    Number.isFinite(mapCenterService.lng)
  ) {
    mapRef.current.panTo(mapCenterService);
    mapRef.current.setZoom(19);
  }
}, [mapRef.current, mapCenterService?.lat, mapCenterService?.lng]);





    useEffect(() => {
      if(activeMarker){
        setMainMarkerPosition({ lat, lng });

        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
        }
      }
    }, [lat, lng]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
  mapRef.current = map;

  // Ejecutar aquí cualquier acción que necesites una vez cargado el mapa
  map.panTo({ lat, lng });
  map.setZoom(zoom);

  if (onLoad) onLoad(map);
}, [onLoad, lat, lng, zoom]);


  const handleMainMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMainMarkerPosition(newPosition);
      if (onMarkerDragEnd) onMarkerDragEnd(newPosition);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mainMarkerPosition}
      zoom={zoom}
      onLoad={handleMapLoad}
      options={{
        styles: mapStyles ?? null,
        disableDefaultUI: true,
        zoomControl: true,
        ...options,
      }}
    >
      {/* Main Marker */}
      <Marker
        position={mainMarkerPosition}
        draggable={draggable}
        icon={icon}
        onDragEnd={handleMainMarkerDragEnd}
      />

      {/* Additional Markers */}
      {additionalMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={marker.icon}
          title={marker.title}
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.panTo(marker.position);
              mapRef.current.setZoom(19);
            }
            onClickMarker?.(marker);
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default CustomMap;
