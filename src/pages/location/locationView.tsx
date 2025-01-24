import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { IStoreModel } from "../../models/storeModel";
import { useHttp } from "../../hooks/http";

// Fix the Leaflet marker icon paths
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function LocationView() {
  const { handleGetRequest } = useHttp();

  const [coordinates, setCoordintes] = useState<IStoreModel[]>([]);

  const handleGetStores = async () => {
    try {
      const result = await handleGetRequest({
        path: "/stores",
      });

      if (result && result?.items) {
        setCoordintes(result?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStores();
  }, []);

  return (
    <MapContainer
      center={[-6.1754, 106.8272] as [number, number]}
      zoom={5}
      maxZoom={20}
      style={{
        height: "75vh",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {coordinates.map((item) => {
        return (
          <Marker
            key={item.storeId}
            position={[+item.storeLatitude, +item.storeLongitude]}
          >
            <Popup>
              <h1>{item?.storeName}</h1>
              <small>Latitude: {item.storeLatitude}</small>
              <br />
              <small>Longitude: {item.storeLongitude}</small>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
