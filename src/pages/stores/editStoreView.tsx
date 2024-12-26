import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { IStoreUpdateRequestModel } from "../../models/storeModel";
import { IconMenus } from "../../components/icon";
import BreadCrumberStyle from "../../components/breadcrumb/Index";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function EditStoreView() {
  const { handleUpdateRequest, handleGetRequest } = useHttp();
  const { storeId } = useParams();

  // State untuk menyimpan data toko
  const [storeName, setStoreName] = useState("");
  const [storeLongitude, setStoreLongitude] = useState("");
  const [storeLatitude, setStoreLatitude] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: IStoreUpdateRequestModel = {
        storeId: storeId!,
        storeName,
        storeLongitude,
        storeLatitude,
        storeAddress,
      };

      await handleUpdateRequest({
        path: "/stores/",
        body: payload,
      });

      window.history.back();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getDetailStore = async () => {
    const result = await handleGetRequest({
      path: "/stores/detail/" + storeId,
    });

    if (result) {
      setStoreName(result?.storeName);
      setStoreLongitude(result?.storeLongitude);
      setStoreLatitude(result?.storeLatitude);
      setStoreAddress(result?.storeAddress);
    }
  };

  useEffect(() => {
    getDetailStore();
  }, []);

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
            label: "Edit",
            link: "/stores/edit/" + storeId,
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
          Edit Store
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
                value={storeName}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Alamat"
                value={storeAddress}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Latitude"
                id="outlined-start-adornment"
                value={storeLatitude}
                fullWidth
                onChange={(e) => {
                  setStoreLatitude(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Longitude"
                id="outlined-start-adornment"
                value={storeLongitude}
                type="text"
                fullWidth
                onChange={(e) => {
                  setStoreLongitude(e.target.value);
                }}
              />
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

            {storeLatitude && storeLongitude && (
              <Marker
                position={[Number(storeLatitude), Number(storeLongitude)]}
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
            <Button
              sx={{
                m: 1,
                width: "25ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant={"contained"}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
