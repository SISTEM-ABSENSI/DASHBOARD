import { Box, Card, Grid, Stack, Typography, alpha } from "@mui/material";
import { blue, green, orange, purple } from "@mui/material/colors";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { useHttp } from "../../hooks/http";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS untuk map
import L from "leaflet";
import { IStoreModel } from "../../models/storeModel";
import { IStatisticModel } from "../../models/statisticModel";
import { LocationOn as LocationIcon } from "@mui/icons-material";

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

const DashboardCard = ({
  icon: Icon,
  title,
  value,
  color,
  onClick,
}: {
  icon: any;
  title: string;
  value: number;
  color: string;
  onClick: () => void;
}) => (
  <Card
    sx={{
      p: 3,
      minWidth: 200,
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: (theme) => theme.shadows[8],
        bgcolor: alpha(color, 0.04),
      },
    }}
    onClick={onClick}
  >
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(color, 0.12),
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon sx={{ fontSize: 28, color: color }} />
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
      </Stack>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </Stack>
  </Card>
);

// DashboardView dengan Statistik dan Peta Toko
const DashboardView = () => {
  const { handleGetRequest } = useHttp();
  const navigation = useNavigate();
  const [isLoading, setIsloading] = useState(true);

  // State untuk Statistik
  const [statistic, setStatistic] = useState<IStatisticModel>({
    totalUsers: 0,
    totalAdmins: 0,
    totalSuperAdmins: 0,
    totalStores: 0,
  });

  // State untuk Koordinat Peta
  const [coordinates, setCoordinates] = useState<IStoreModel[]>([]);

  // Fungsi untuk mengambil Statistik Dashboard
  const handleGetStatistic = async () => {
    try {
      const result = await handleGetRequest({
        path: "/statistic",
      });

      console.log(result);
      if (result) {
        setStatistic(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fungsi untuk mengambil Koordinat Toko untuk Peta
  const handleGetStores = async () => {
    try {
      const result = await handleGetRequest({
        path: "/stores",
      });

      if (result?.items) {
        setCoordinates(result?.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    await handleGetStatistic();
    await handleGetStores();
    setIsloading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return "laoding...";

  return (
    <Box>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Dashboard",
            link: "/",
            icon: <IconMenus.dashboard fontSize="small" />,
          },
        ]}
      />

      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="medium"
          color="text.primary"
        >
          Dashboard Overview
        </Typography>

        <Grid container spacing={3} mt={1}>
          <Grid item md={3} sm={6} xs={12}>
            <DashboardCard
              icon={IconMenus.user}
              title="Users"
              value={statistic.totalUsers}
              color={blue[500]}
              onClick={() => navigation("/users")}
            />
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <DashboardCard
              icon={IconMenus.admin}
              title="Admins"
              value={statistic.totalAdmins}
              color={green[500]}
              onClick={() => navigation("/admins")}
            />
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <DashboardCard
              icon={IconMenus.admin}
              title="Super Admins"
              value={statistic.totalSuperAdmins}
              color={purple[500]}
              onClick={() => navigation("/admins")}
            />
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <DashboardCard
              icon={IconMenus.store}
              title="Stores"
              value={statistic.totalStores}
              color={orange[500]}
              onClick={() => navigation("/stores")}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} mt={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              minWidth: 200,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: (theme) =>
                `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      fontSize: 24,
                    }}
                  />
                  <Typography variant="h6" fontWeight="600">
                    Store Locations
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {coordinates.length} stores
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: "75vh",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <MapContainer
                  center={[-6.1754, 106.8272]}
                  zoom={5}
                  maxZoom={20}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {coordinates.map((item) => (
                    <Marker
                      key={item.storeId}
                      position={[+item.storeLatitude, +item.storeLongitude]}
                    >
                      <Popup>
                        <Box sx={{ p: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            gutterBottom
                          >
                            {item.storeName}
                          </Typography>

                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Latitude: {item.storeLatitude}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Longitude: {item.storeLongitude}
                            </Typography>
                          </Stack>
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardView;
