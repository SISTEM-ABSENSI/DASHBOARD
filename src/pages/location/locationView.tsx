import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { IStoreModel } from "../../models/storeModel";
import { useHttp } from "../../hooks/http";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  alpha,
  InputAdornment,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";

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
  const [coordinates, setCoordinates] = useState<IStoreModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<IStoreModel[]>([]);

  const handleGetStores = async () => {
    try {
      setLoading(true);
      const result = await handleGetRequest({
        path: "/stores",
      });

      if (result && result?.items) {
        setCoordinates(result.items);
        setFilteredStores(result.items);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetStores();
  }, []);

  useEffect(() => {
    const filtered = coordinates.filter((store) =>
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, coordinates]);

  return (
    <Box sx={{ p: 2 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(
              blue[600],
              0.1
            )} 0%, ${alpha(blue[100], 0.1)} 100%)`,
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <LocationIcon sx={{ color: blue[600], fontSize: 28 }} />
                <Stack spacing={0.5}>
                  <Typography variant="h5" fontWeight="600">
                    Store Locations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredStores.length} stores found
                  </Typography>
                </Stack>
              </Stack>

              <TextField
                size="small"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 250,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                  },
                }}
              />
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ position: "relative" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255, 255, 255, 0.8)",
                zIndex: 999,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <MapContainer
            center={[-6.1754, 106.8272]}
            zoom={5}
            maxZoom={20}
            style={{
              height: "75vh",
              width: "100%",
              borderRadius: "0 0 8px 8px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {filteredStores.map((item) => (
              <Marker
                key={item.storeId}
                position={[+item.storeLatitude, +item.storeLongitude]}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StoreIcon sx={{ color: blue[600] }} />
                        <Typography variant="h6">{item.storeName}</Typography>
                      </Stack>

                      <Stack spacing={1}>
                        <Chip
                          size="small"
                          icon={<LocationIcon />}
                          label={`Lat: ${item.storeLatitude}`}
                          sx={{ width: "fit-content" }}
                        />
                        <Chip
                          size="small"
                          icon={<LocationIcon />}
                          label={`Long: ${item.storeLongitude}`}
                          sx={{ width: "fit-content" }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Card>
    </Box>
  );
}
