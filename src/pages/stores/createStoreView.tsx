import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { IStoreCreateRequestModel } from "../../models/storeModel";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppContext } from "../../context/app.context";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function CreateStoreView() {
  const { handlePostRequest } = useHttp();
  const navigate = useNavigate();
  const { setAppAlert } = useAppContext();

  const [storeName, setStoreName] = useState("");
  const [storeLongitude, setStoreLongitude] = useState("");
  const [storeLatitude, setStoreLatitude] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [showCoordinate, setShowCoordinate] = useState(false);

  const isValidCoordinate = (latitude: string, longitude: string): boolean => {
    const coordinateRegex = /^-?\d+(\.\d+)?$/;

    if (
      !coordinateRegex.test(latitude.trim()) ||
      !coordinateRegex.test(longitude.trim())
    ) {
      return false;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const handleViewMap = () => {
    if (isValidCoordinate(storeLatitude, storeLongitude)) {
      setShowCoordinate(true);
    } else {
      setAppAlert({
        isDisplayAlert: true,
        message:
          "Invalid coordinates! Latitude must be between -90 and 90, and Longitude must be between -180 and 180.",
        alertType: "error",
      });
      setShowCoordinate(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: IStoreCreateRequestModel = {
        storeName,
        storeLongitude,
        storeLatitude,
        storeAddress,
      };

      await handlePostRequest({
        path: "/stores",
        body: payload,
      });

      navigate("/stores");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Store",
            link: "/stores",
            icon: <IconMenus.store fontSize="small" />,
          },
          {
            label: "Create",
            link: "/stores/create",
          },
        ]}
      />
      <Card
        sx={{
          mt: 5,
          p: { xs: 3, md: 5 },
        }}
      >
        <Typography
          variant="h4"
          marginBottom={5}
          color="primary"
          fontWeight={"bold"}
        >
          Create Store
        </Typography>
        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nama Toko"
                placeholder="example: Toko A"
                id="outlined-start-adornment"
                value={storeName}
                fullWidth
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Alamat Toko"
                placeholder="example: Jl. Raya"
                id="outlined-start-adornment"
                value={storeAddress}
                fullWidth
                minRows={4}
                onChange={(e) => {
                  setStoreAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Latitude"
                placeholder="example: -6.1754"
                id="outlined-start-adornment"
                value={storeLatitude}
                fullWidth
                onChange={(e) => {
                  setStoreLatitude(e.target.value);
                  setShowCoordinate(false);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
                placeholder="example: 106.8272"
                id="outlined-start-adornment"
                value={storeLongitude}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreLongitude(e.target.value);
                  setShowCoordinate(false);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={handleViewMap}
                variant="contained"
                disabled={!storeLongitude || !storeLatitude}
              >
                Lihat Peta
              </Button>
            </Grid>
          </Grid>

          <MapContainer
            center={[-6.1754, 106.8272] as [number, number]}
            zoom={5}
            maxZoom={20}
            style={{
              height: "75vh",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {showCoordinate && (
              <Marker
                position={[
                  Number(storeLatitude.trim()),
                  Number(storeLongitude.trim()),
                ]}
              >
                <Popup>
                  <h1>{storeName}</h1>
                  position={[Number(storeLatitude), Number(storeLongitude)]}
                  <small>Latitude: {storeLatitude}</small>
                  <br />
                  <small>Longitude: {storeLongitude}</small>
                </Popup>
              </Marker>
            )}
          </MapContainer>
          <Stack direction={"row"} justifyContent="flex-end">
            <Button variant={"contained"} onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
